/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Chat routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('chats')
const controller = require('./chats.controller')
const auth = require('../../services/auth.service')

/**
 * @interface getUserChats
 * Gets all user chats.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let chats = await controller.getUserChats({ _id: req.user._id })
    return res.status(200).json(chats)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getChat
 * Get chat messages.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let messages = await controller.getChatMessages(req.params.user, req.params.id)
    return res.status(200).json(messages)
  } catch (e) {
    error(e)
  }
})

module.exports = router
