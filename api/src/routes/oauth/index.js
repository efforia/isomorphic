/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
import express from 'express'
import passport from 'passport'
import controller from './oauth.controller'


const router = express.Router('oauth')

/**
 * @interface accessWithFacebook
 * Sign up or sign in user on the platform based on its facebook token.
 */
router.post(
  '/access/facebook',
  passport.authenticate('facebook-token', { session: false }),
  async (req, res, error) => {
    try {
      const profile = req.user // Gets the social profile
      const user = await controller.accessWithFacebook(profile)
      return res.status(200).json(user)
    } catch (e) {
      error(e)
    }
  }
)

export default router
