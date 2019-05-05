/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('market-item-attributes')
const controller = require('./market-item-attributes.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface save
 * Adds item attribute to the database.
 */
router.post('/', auth.isAdmin(), async (req, res, error) => {
  try {
    let attributeInfo = req.body
    let attribute = await controller.save(attributeInfo)
    return res.status(200).json(attribute)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface list
 * List item attributes from the database.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let attributes = await controller.list()
    return res.status(200).json(attributes)
  } catch (e) {
    error(e)
  }
})

module.exports = router
