/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Bank account module routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('card-references')
const controller = require('./card-references.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface addPaymentCard
 * Adds payment card to the user payment information.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let cardInfo = req.body // Gets the card information
    let created = await controller.add(user, cardInfo)
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
    let user = req.user
    let id = req.params.id // Gets the payment card id
    let removed = await controller.remove(user, id)
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
    let user = req.user
    let cards = await controller.list(user)
    return res.status(200).json(cards)
  } catch (e) {
    error(e)
  }
})

module.exports = router
