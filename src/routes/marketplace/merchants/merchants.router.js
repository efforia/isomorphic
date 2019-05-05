/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('merchants')
const controller = require('./merchants.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface details
 * Gets merchant details by the _id.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id
    let merchant = await controller.details(id)
    return res.status(200).json(merchant)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface details
 * Gets merchant details by the username.
 */
router.get('/by-username/:username', async (req, res, error) => {
  try {
    let username = req.params.username
    let merchant = await controller.details(undefined, username)
    return res.status(200).json(merchant)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface nearbyMerchants
 * Gets the nearby merchants for the given coordinates and keyword filter.
 */
router.get('/by-location/nearby', async (req, res, error) => {
  try {
    let latitude = req.query.latitude
    let longitude = req.query.longitude
    let radius = req.query.radius
    let keyword = req.query.keyword
    let merchants = await controller.nearbyMerchants(latitude, longitude, radius, keyword)
    return res.status(200).json(merchants)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface nearbyByService
 * Gets the nearby merchants for the given coordinates, keyword filter and provided service.
 */
router.get('/nearby/:service', async (req, res, error) => {
  try {
    let service = req.params.service
    let latitude = req.query.latitude
    let longitude = req.query.longitude
    let radius = req.query.radius
    let keyword = req.query.keyword
    let merchants = await controller.nearbyByService(service, latitude, longitude, radius, keyword)
    return res.status(200).json(merchants)
  } catch (e) {
    error(e)
  }
})

module.exports = router
