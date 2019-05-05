/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Bank account module routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './card-references.controller'
import auth from '../../../services/auth.service'


const router = express.Router('card-references')

/**
 * @interface addPaymentCard
 * Adds payment card to the user payment information.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const cardInfo = req.body // Gets the card information
    const created = await controller.add(user, cardInfo)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removePaymentCard
 *  Removes payment card from the user payment information.
 */
router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const {id} = req.params // Gets the payment card id
    const removed = await controller.remove(user, id)
    return res.status(200).json(removed)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listPaymentCards
 * List payment cards from the user payment information.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const cards = await controller.list(user)
    return res.status(200).json(cards)
  } catch (e) {
    error(e)
  }
})

export default router
