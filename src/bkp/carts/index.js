/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './carts.controller'

const router = express.Router('carts')

/**
 * @interface create
 * Creates new cart on the database.
 */
router.post('/', async (req, res, error) => {
  try {
    const cartInfo = req.body
    const cart = await controller.create(cartInfo)
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
    const {id} = req.params // Gets cart id.
    const cart = await controller.get(id)
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
    const {id} = req.params
    const cleared = await controller.clear(id)
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
    const {id} = req.params
    const {category} = req.params
    const items = await controller.getCategoryItems(id, category)
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
    const {id} = req.params
    const item = req.body
    const updatedCart = await controller.incrementItem(id, item)
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
    const {id} = req.params
    const item = req.body
    const updatedCart = await controller.decrementItem(id, item)
    return res.status(200).json(updatedCart)
  } catch (e) {
    error(e)
  }
})

export default router
