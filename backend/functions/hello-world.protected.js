const { ProtectedUtils } = require('@demoeng/serverless-core')

exports.handler = ProtectedUtils(async function (
  context,
  event,
  callback,
  helpers
) {
  helpers.logger.debug(
    'starting hello-world session params: ' + helpers.stringify(event)
  )

  const response = helpers.twilio.defaultResponse()

  try {
    // do some things
    const resultObj = {}
    helpers.logger.debug(`a thing was done: ${helpers.stringify(resultObj)}`)
    response.setBody(resultObj)
    callback(null, response)
  } catch (error) {
    helpers.logger.error(
      `unable to complete a thing: ${helpers.stringify(error)}`
    )
    response.setBody(error)
    callback(response)
  }
})
