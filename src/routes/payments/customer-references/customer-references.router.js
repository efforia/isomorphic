/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer category routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../../swagger/swagger.router'

import SwaggerUtils from '../../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('customer-references')
import controller from './customer-references.controller'
import auth from '../../../services/auth.service'

/**
 * @interface create
 * Creates an payment account for the customer
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.body
    let account = await controller.create(user)
    return res.status(200).json(account)
  } catch (e) {
    error(e)
  }
})

export default router
