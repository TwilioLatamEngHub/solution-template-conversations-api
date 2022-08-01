'use strict'

const functions = Runtime.getFunctions() //eslint-disable-line no-undef

class Helpers {
  constructor() {
    /*
     * Load SMS Helper Methods
     */
    const smsLib = require(functions['helpers/sms'].path).SmsHelper
    this.sms = new smsLib()

    /*
     * Load Conversation Helper Methods
     */
    const convLib = require(functions['helpers/conversations']
      .path).ConversationsHelper
    this.conversations = new convLib()

    this.createClient = (context) => {
      const { ACCOUNT_SID, AUTH_TOKEN } = context
      return require('twilio')(ACCOUNT_SID, AUTH_TOKEN, {
        lazyLoading: true,
      })
    }
  }
}

/** @module helpers */
module.exports = Helpers
