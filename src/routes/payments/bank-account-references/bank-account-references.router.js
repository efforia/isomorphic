/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Bank account routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../../swagger/swagger.router'

import SwaggerUtils from '../../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('bank-account-references')
import controller from './bank-account-references.controller'
import auth from '../../../services/auth.service'

/**
 * @interface addBankAccount
 * Adds bank account to the user payment information.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let accountInfo = req.body
    let created = await controller.add(user, accountInfo)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listBankAccounts
 * List bank accounts from the user payment information.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let accounts = await controller.list(user)
    return res.status(200).json(accounts)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removeBankAccount
 * Removes bank account from the user payment information.
 */
router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let id = req.params.id // Gets bank account id
    let updatedAccounts = await controller.remove(user, id)
    return res.status(200).json(updatedAccounts)
  } catch (e) {
    error(e)
  }
})

export default router
