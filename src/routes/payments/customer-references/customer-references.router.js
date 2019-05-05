/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer category routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('customer-references')
const controller = require('./customer-references.controller')
const auth = require('../../../services/auth.service')

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

module.exports = router
