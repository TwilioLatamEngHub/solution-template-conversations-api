class SmsHelper {
  /**
   * @param {twilio.Client} twilioClient
   * @param {string} from - Which Twilio Number to send from
   * @param {string} to - Which Customer Phone Number to send to
   * @param {string} body
   * @returns {Promise}
   */
  sendMessage(twilioClient, from, to, body) {
    return twilioClient.messages.create({
      from,
      to,
      body,
    })
  }
}

/** @module smsHelper */
module.exports = {
  SmsHelper,
}
