/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('oauth')
const controller = require('./oauth.controller')
const passport = require('passport')

/**
 * @interface accessWithFacebook
 * Sign up or sign in user on the platform based on its facebook token.
 */
router.post(
  '/access/facebook',
  passport.authenticate('facebook-token', { session: false }),
  async (req, res, error) => {
    try {
      let profile = req.user // Gets the social profile
      let user = await controller.accessWithFacebook(profile)
      return res.status(200).json(user)
    } catch (e) {
      error(e)
    }
  }
)

module.exports = router
