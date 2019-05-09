/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './order.controller'
import auth from '../../services/auth.service'

const router = express.Router('orders')

/**
 * @interface createOrder
 * Creates an order.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const { user } = req
    const orderInfo = req.body
    const order = await controller.create(user, orderInfo)
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
    const { user } = req
    const {status} = req.query
    const orders = await controller.getOrdersByUserId(user, status)
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
    const { user } = req
    const {status} = req.query
    const {startDate} = req.query
    const {endDate} = req.query
    const dates = await controller.getOrdersByDatesAndUserId(user, startDate, endDate, status)
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
    const { user } = req
    const { id } = req.params
    const order = await controller.getById(user, id)
    return res.status(200).json(order)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface acceptOrder
 * Updates order status to accepted and executes the necessary operations.
 */
router.post('/:id/accept', auth.isDriver(), async (req, res, error) => {
  try {
    const { user } = req
    const { id } = req.params
    const accepted = await controller.accept(user, id)
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
    const { id } = req.params
    const canceled = await controller.cancel(id)
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
    const { user } = req
    const { id } = req.params
    const {rate} = req.params
    const updated = await controller.rate(user, id, rate)
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
    const receivingModes = await controller.listReceivingModes()
    return res.status(200).json(receivingModes)
  } catch (e) {
    error(e)
  }
})

export default router
