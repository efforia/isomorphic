/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('transfer-references')
const controller = require('./transfer-references.controller')
const auth = require('../../../services/auth.service')

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

module.exports = router
