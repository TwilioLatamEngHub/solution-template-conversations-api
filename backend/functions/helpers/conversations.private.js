class ConversationsHelper {
  constructor() {
    //have webhooks enabled so frontline service can add timers and friendly_names to participants
    this.xTwilioWebhookEnabled = true
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} friendlyName
   * @param {Object} attributes
   * @returns {Promise}
   */
  createConversation(twilioClient, serviceSid, friendlyName, attributes) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations.create({
        friendlyName,
        attributes,
        xTwilioWebhookEnabled: this.xTwilioWebhookEnabled,
      })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @param {string} address - Participants phone number, whatsapp, etc
   * @param {string} proxyAddress - Twilio number to use to manage conversation
   * @param {Object} attributes - attributes to add to the participant object
   * @returns {Promise}
   */
  addNonChatParticipant(
    twilioClient,
    serviceSid,
    conversationSid,
    address,
    proxyAddress,
    attributes
  ) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .participants.create({
        'messagingBinding.address': address,
        'messagingBinding.proxyAddress': proxyAddress,
        attributes,
        xTwilioWebhookEnabled: this.xTwilioWebhookEnabled,
      })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @param {string} identity - Workers chat service identity
   * @param {Object} attributes - attributes to add to the participant object
   * @returns {Promise}
   */
  addParticipant(
    twilioClient,
    serviceSid,
    conversationSid,
    identity,
    attributes
  ) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .participants.create({
        identity,
        attributes,
        xTwilioWebhookEnabled: this.xTwilioWebhookEnabled,
      })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @param {string} body
   * @param {string} author
   * @returns {Promise}
   */
  sendChannelMessage(twilioClient, serviceSid, conversationSid, body, author) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .messages.create({
        body,
        author,
        xTwilioWebhookEnabled: this.xTwilioWebhookEnabled,
      })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @param {string} participantSid
   * @returns {Promise}
   */
  removeParticipant(twilioClient, serviceSid, conversationSid, participantSid) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .participants(participantSid)
      .remove()
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @param {string} state - active, inactive, or closed
   * @returns {Promise}
   */
  updateState(twilioClient, serviceSid, conversationSid, state) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .update({ state, xTwilioWebhookEnabled: this.xTwilioWebhookEnabled })
  }

  /**
   * @param {twilio.Client} twilioClient
   * @param {string} serviceSid
   * @param {string} conversationSid
   * @returns {Promise}
   */
  endConversation(twilioClient, serviceSid, conversationSid) {
    return twilioClient.conversations
      .services(serviceSid)
      .conversations(conversationSid)
      .remove()
  }
}

/** @module conversationsHelper */
module.exports = {
  ConversationsHelper,
}
