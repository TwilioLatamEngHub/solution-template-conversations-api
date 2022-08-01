const shouldSendWorkerNotification = (workerPhone, message) => {
  return workerPhone && workerPhone !== '' && message && message != ''
}

const sanitizePhone = (phone) => {
  if (phone.indexOf(' ') > -1) {
    phone = phone.replace(' ', '+')
  }
  return phone
}

const getConversationFriendlyName = (taskIntent, orderNumber, customerName) => {
  if (taskIntent === 'delivery_details') {
    return `Order #${orderNumber}`
  } else if (taskIntent === 'pickup_details') {
    return `Order #${orderNumber}`
  } else if (taskIntent === 'shoppingAssistance') {
    return `Client: ${customerName}`
  }
}

const startConversation = async (context, event, helpers) => {
  const client = helpers.createClient(context)
  const response = helpers.twilio.defaultResponse()
  helpers.logger.debug(`starting conversation: ${helpers.stringify(event)}`)

  let proxyAddress = sanitizePhone(event.fromNumber)
  let workerPhone = sanitizePhone(event.workerPhone) // "drivers" phone number: Optional step. Only if you are having the "Driver" use an app
  let customerAddress = sanitizePhone(event.customerPhone)

  const { WEBAPP_URL, CONVERSATION_SERVICE_SID: convServiceSid } = context
  const {
    workerIdentity,
    workerName,
    customerName,
    orderNumber,
    taskIntent,
    topic,
    customerId,
    channelType,
  } = event

  const redacted = customerAddress.match(/(whatsapp:)?[+][0-9]+/)
    ? customerAddress.substring(0, customerAddress.length - 4) + 'XXXX'
    : customerAddress

  try {
    const conversationFriendlyName = getConversationFriendlyName(
      taskIntent,
      orderNumber,
      customerName
    )

    helpers.logger.debug(
      `starting to create converation ${conversationFriendlyName}`
    )

    const conv = await helpers.conversations.createConversation(
      client,
      convServiceSid,
      conversationFriendlyName,
      {}
    )

    helpers.logger.debug(`created conversation ${helpers.stringify(conv)}`)

    let notificationMessage, conversationStartMessage, responseSayMessage
    if (taskIntent === 'delivery_details') {
      notificationMessage = `[ATTN] The customer (${customerName}) for delivery #${orderNumber} has asked for an ETA. Please reach out when safe to do so at: ${WEBAPP_URL}/channels/${conv.sid}`
      conversationStartMessage = `${customerName} (${redacted}) is now connected with driver: ${workerName}`
      if (channelType === 'whatsapp' || channelType === 'sms') {
        responseSayMessage = `We have contacted the driver ${workerName}, they should reach out to you shortly.`
      } else {
        responseSayMessage = `We have contacted your driver ${workerName}, they will reach out to you via sms shortly.`
      }
    } else if (taskIntent === 'pickup_details') {
      const vehicleDetails = event.vehicleDetails || 'Red Tesla Model Y'
      notificationMessage = `[ATTN] The customer (${customerName}) for pickup #${orderNumber} has arrived in ${vehicleDetails}. Please reach out when safe to do so at: ${WEBAPP_URL}/channels/${conv.sid}`
      conversationStartMessage = `${customerName} (${redacted}) is now connected with curbside operator: ${workerName}. ${customerName} has arrived in ${vehicleDetails}`
      responseSayMessage = `We have contacted your curbside operator ${workerName} and they will be out shortly.`
    } else if (taskIntent === 'shoppingAssistance') {
      notificationMessage = `[ATTN] A new client (${customerName}) has asked for assistance with shopping for ${topic}. Please reach out when available: ${WEBAPP_URL}/channels/${conv.sid}`
      conversationStartMessage = `Hey ${customerName}, let me introduce your new personal shopper, ${workerName}. ${customerName} is looking for insight about ${topic}`
      if (channelType === 'whatsapp' || channelType === 'sms') {
        responseSayMessage = `We have contacted ${workerName} to help you find the perfect fit. 👟`
      } else {
        responseSayMessage = `We have contacted ${workerName} to help you find the perfect fit 👟, they will reach out to you via sms shortly.`
      }
    }

    let workerParticipant = await helpers.conversations.addParticipant(
      client,
      convServiceSid,
      conv.sid,
      workerIdentity,
      {
        display_name: workerName,
      }
    )
    helpers.logger.debug(`added worker participant ${workerParticipant.sid}`)

    let customerParticipant = await helpers.conversations.addNonChatParticipant(
      client,
      convServiceSid,
      conv.sid,
      customerAddress,
      proxyAddress,
      {
        display_name: customerName,
        customer_id: customerId,
        avatar: undefined,
      }
    )
    helpers.logger.debug(
      `added customer participant ${customerParticipant.sid}`
    )

    if (shouldSendWorkerNotification(workerPhone, notificationMessage)) {
      //if worker mobile is not whatsapp, send from an sms number
      if (
        workerPhone.indexOf('whatsapp') === -1 &&
        proxyAddress.indexOf('whatsapp') > -1
      ) {
        proxyAddress = proxyAddress.replace('whatsapp:', '')
        helpers.logger.debug('sending worker sms to new whatsapp conversation')
      } else {
        helpers.logger.debug(
          `sending notification message to ${workerPhone} from ${proxyAddress}`
        )
      }

      let notifyMessage = await helpers.sms.sendMessage(
        client,
        proxyAddress,
        workerPhone,
        notificationMessage
      )
      helpers.logger.debug(`sent notify driver message ${notifyMessage.sid}`)
    } else {
      helpers.logger.debug(
        'no worker phone number to notify of new conversation'
      )
    }

    try {
      const startMessage = await helpers.conversations.sendChannelMessage(
        client,
        convServiceSid,
        conv.sid,
        conversationStartMessage
      )
      helpers.logger.debug(`sent start message ${startMessage.sid}`)
    } catch (err) {
      helpers.logger.debug(
        'trying initial conversation message again by sending as worker'
      )
      const startMessage = await helpers.conversations.sendChannelMessage(
        client,
        convServiceSid,
        conv.sid,
        conversationStartMessage,
        workerIdentity
      )
      helpers.logger.debug(
        `start message sent ${helpers.stringify(startMessage)}`
      )
    }

    response.setBody({
      message: responseSayMessage,
    })
    return response
  } catch (err) {
    helpers.logger.error(
      'error starting conversation ' + helpers.stringify(err)
    )
    throw err
  }
}

module.exports = startConversation
