import { createRouter, defineEventHandler, useBase } from 'h3'
import { chatController } from '#server/controllers'

const router = createRouter()

router.post('/chat', defineEventHandler(chatController.sendMessage))

export default useBase('/api', router.handler)
