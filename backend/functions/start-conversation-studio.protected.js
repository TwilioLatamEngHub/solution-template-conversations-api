/**
 * This function initiates a new conversation between a known customer and known worker
 *
 * Creates new conversation
 * Adds worker participant (as chat member)
 * Adds customer participant (with any channel type besides chat)
 * (Optional) sends sms notification to worker
 * Sends initial message in conversation
 */

const { ProtectedUtils } = require('@demoeng/serverless-core')
const ServiceHelpers = require(Runtime.getFunctions()['helpers/index'].path)
const startConversation = require(Runtime.getFunctions()[
  'shared/start-conversation'
].path)

exports.handler = ProtectedUtils(async function (
  context,
  event,
  callback,
  helpers
) {
  try {
    const serviceHelpers = new ServiceHelpers(context, event)
    helpers = {
      ...helpers,
      ...serviceHelpers,
    }
    const response = await startConversation(context, event, helpers)
    callback(null, response)
  } catch (err) {
    helpers.logger.error('error starting conversation from studio: ' + err)
    callback(err)
  }
})
