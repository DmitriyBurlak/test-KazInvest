import { isAppError } from '#server/utils/error'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error) => {
    if (!isAppError(error)) {
      return
    }

    Object.assign(error, {
      statusCode: error.statusCode,
      statusMessage: error.message,
      data: {
        code: error.code,
        ...(error.details !== undefined ? { details: error.details } : {})
      }
    })
  })
})
