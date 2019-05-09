/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './merchant-ref.controller'
import auth from '../../../services/auth.service'


const router = express.Router('merchant-ref')

/**
 * @interface create
 * Creates an payment account for the merchant
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const user = req.body
    const account = await controller.create(user)
    return res.status(200).json(account)
  } catch (e) {
    error(e)
  }
})

export default router
