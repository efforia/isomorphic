/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Driver category routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './drivers.controller'

const router = express.Router('drivers')

router.post('/', async (req, res, error) => {
  try {
    const userInfo = req.body
    const created = await controller.create(userInfo)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', async (req, res, error) => {
  try {
    const { id } = req.params
    const driver = await controller.read(id)
    return res.status(200).json(driver)
  } catch (e) {
    error(e)
  }
})

router.get('/by-username/:username', async (req, res, error) => {
  try {
    const { username } = req.params
    const driver = await controller.read(undefined, username)
    return res.status(200).json(driver)
  } catch (e) {
    error(e)
  }
})

router.get('/by-location/nearby', async (req, res, error) => {
  try {
    const { latitude } = req.query
    const { longitude } = req.query
    const { radius } = req.query
    const { keyword } = req.query
    const drivers = await controller.nearbyDrivers(latitude, longitude, radius, keyword)
    return res.status(200).json(drivers)
  } catch (e) {
    error(e)
  }
})

router.get('/nearby/:service', async (req, res, error) => {
  try {
    const { service } = req.params
    const { latitude } = req.query
    const { longitude } = req.query
    const { radius } = req.query
    const { keyword } = req.query
    const drivers = await controller.nearbyByService(
      service,
      latitude,
      longitude,
      radius,
      keyword
    )
    return res.status(200).json(drivers)
  } catch (e) {
    error(e)
  }
})

export default router
