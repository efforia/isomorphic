/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './merchants.controller'

const router = express.Router('merchants')

/**
 * @interface details
 * Gets merchant details by the _id.
 */
router.get('/:id', async (req, res, error) => {
  try {
    const {id} = req.params
    const merchant = await controller.details(id)
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
    const {username} = req.params
    const merchant = await controller.details(undefined, username)
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
    const {latitude} = req.query
    const {longitude} = req.query
    const {radius} = req.query
    const {keyword} = req.query
    const merchants = await controller.nearbyMerchants(latitude, longitude, radius, keyword)
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
    const {service} = req.params
    const {latitude} = req.query
    const {longitude} = req.query
    const {radius} = req.query
    const {keyword} = req.query
    const merchants = await controller.nearbyByService(service, latitude, longitude, radius, keyword)
    return res.status(200).json(merchants)
  } catch (e) {
    error(e)
  }
})

export default router
