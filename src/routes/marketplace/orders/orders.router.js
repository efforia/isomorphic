/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../../swagger/swagger.router'

import SwaggerUtils from '../../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('orders')
import controller from './orders.controller'
import auth from '../../../services/auth.service'

/**
 * @interface createOrder
 * Creates an order.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let orderInfo = req.body
    let order = await controller.create(user, orderInfo)
    return res.status(200).json(order)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getOrdersByUserId
 * Lists orders based on user id.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let status = req.query.status
    let orders = await controller.getOrdersByUserId(user, status)
    return res.status(200).json(orders)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getOrdersByDatesAndUserId
 * Lists orders based on user id and time period.
 */
router.get('/between-dates', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let status = req.query.status
    let startDate = req.query.startDate
    let endDate = req.query.endDate
    let dates = await controller.getOrdersByDatesAndUserId(user, startDate, endDate, status)
    return res.status(200).json(dates)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getOrder
 * Retrieves order information.
 */
router.get('/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let id = req.params.id
    let order = await controller.getById(user, id)
    return res.status(200).json(order)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface acceptOrder
 * Updates order status to accepted and executes the necessary operations.
 */
router.post('/:id/accept', auth.isMerchant(), async (req, res, error) => {
  try {
    let user = req.user
    let id = req.params.id
    let accepted = await controller.accept(user, id)
    return res.status(200).json(accepted)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface cancelOrder
 * Updates order status to cancelled and executes the necessary operations.
 */
router.get('/:id/cancel', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let id = req.params.id
    let canceled = await controller.cancel(id)
    return res.status(200).json(canceled)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface rateOrder
 * Adds rating information to the order.
 */
router.post('/:id/rate/:rate', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let id = req.params.id
    let rate = req.params.rate
    let updated = await controller.rate(user, id, rate)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listReceivingModes
 * List order receiving modes.
 */
router.get('/receiving-modes', async (req, res, error) => {
  try {
    let receivingModes = await controller.listReceivingModes()
    return res.status(200).json(receivingModes)
  } catch (e) {
    error(e)
  }
})

export default router
