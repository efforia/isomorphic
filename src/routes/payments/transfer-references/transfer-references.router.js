/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../../swagger/swagger.router'

import SwaggerUtils from '../../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('transfer-references')
import controller from './transfer-references.controller'
import auth from '../../../services/auth.service'

/**
 * @interface getAvailabeWithdrawal
 * Gets future and current balance for a given merchant.
 */
router.get('/available', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let withdrawal = await controller.getAvailabeWithdrawal(user)
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
    let user = req.user
    let amount = req.body.amount
    let bankAccount = req.body.bankAccount
    let withdrawal = await controller.transferWithdrawal(user, bankAccount, amount)
    return res.status(200).json(withdrawal)
  } catch (e) {
    error(e)
  }
})

export default router
