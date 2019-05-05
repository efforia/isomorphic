/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Chat routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('comments')
const controller = require('./comments.controller')
const auth = require('../../services/auth.service')

/**
 * @interface saveComment
 * Gets all user comments.
 */
router.post('/:post', auth.hasValidToken(), async (req, res, error) => {
  try {
    let post = req.params.post
    let comment = req.body
    let comments = await controller.save(post, comment)
    return res.status(200).json(comments)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getByPost
 * Gets all user comments.
 */
router.get('/:post', async (req, res, error) => {
  try {
    let post = req.params.post
    let comments = await controller.getByPost({ _id: post })
    return res.status(200).json(comments)
  } catch (e) {
    error(e)
  }
})

module.exports = router
