/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './transfer-ref.controller'
import auth from '../../../services/auth.service'


const router = express.Router('transfer-ref')

/**
 * @interface getAvailabeWithdrawal
 * Gets future and current balance for a given merchant.
 */
router.get('/available', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const withdrawal = await controller.getAvailabeWithdrawal(user)
    return res.status(200).json(withdrawal)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface transferWithdrawal
 * Gets future and current balance for a given merchant.
 */
router.post('/transfer', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const {amount} = req.body
    const {bankAccount} = req.body
    const withdrawal = await controller.transferWithdrawal(user, bankAccount, amount)
    return res.status(200).json(withdrawal)
  } catch (e) {
    error(e)
  }
})

export default router
