/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('carts')
const controller = require('./carts.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface create
 * Creates new cart on the database.
 */
router.post('/', async (req, res, error) => {
  try {
    let cartInfo = req.body
    let cart = await controller.create(cartInfo)
    return res.status(200).json(cart)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface get
 * Get cart from the database.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id // Gets cart id.
    let cart = await controller.get(id)
    return res.status(200).json(cart)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface clear
 * Clears cart on the database.
 */
router.put('/:id/clear', async (req, res, error) => {
  try {
    let id = req.params.id
    let cleared = await controller.clear(id)
    return res.status(200).json(cleared)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getCategoryItems
 * Get cart items within certain category from the database.
 */
router.get('/:id/items/list/:category', async (req, res, error) => {
  try {
    let id = req.params.id
    let category = req.params.category
    let items = await controller.getCategoryItems(id, category)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface incrementItem
 * Increments item quantity on a given cart.
 */
router.put('/:id/items/increment', async (req, res, error) => {
  try {
    let id = req.params.id
    let item = req.body
    let updatedCart = await controller.incrementItem(id, item)
    return res.status(200).json(updatedCart)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface decrementItem
 * Decrements item quantity on a given cart.
 */
router.put('/:id/items/decrement', async (req, res, error) => {
  try {
    let id = req.params.id
    let item = req.body
    let updatedCart = await controller.decrementItem(id, item)
    return res.status(200).json(updatedCart)
  } catch (e) {
    error(e)
  }
})

module.exports = router
