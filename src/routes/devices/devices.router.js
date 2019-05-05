/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Device routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('devices')
const controller = require('./devices.controller')
const auth = require('../../services/auth.service')

/**
 * @interface saveDevice
 * Adds device to the user list.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let device = req.body
    let user = req.user
    let devices = await controller.save(user, device)
    return res.status(200).json(devices)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getDevice
 * Gets device information based on the id.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id
    let device = await controller.get(id)
    return res.status(200).json(device)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getDevicesByUser
 * Lists devices based on the user id.
 */
router.get('/by-user', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let devices = await controller.getByUser(user)
    return res.status(200).json(devices)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getDevicesByStatus
 * Lists devices based on the provided status.
 */
router.get('/by-status/:status', async (req, res, error) => {
  try {
    let status = req.params.status
    let location = {
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude)
    }
    let page = parseInt(req.query.page || 1) // Parses the page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses the page size
    let devices = await controller.getByStatus(status, location, page, pageSize)
    return res.status(200).json(devices)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface addDevice
 * Adds device to the user list.
 */
router.post('/add', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let device = req.body
    let user = req.user
    let saved = await controller.addToUser(user, device)
    return res.status(200).json(saved)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removeDevice
 * Removes device from the user list.
 */
router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let device = req.params.id
    let user = req.user
    let devices = controller.remove(user, device)
    return res.status(200).json(devices)
  } catch (e) {
    error(e)
  }
})

module.exports = router
