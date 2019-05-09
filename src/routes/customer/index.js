/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './customer.controller'
import auth from '../../services/auth.service'

const router = express.Router('customers')

/**
 * @interface addFavourite
 * Adds favourite merchant to the user.
 */
router.post('/favourites/merchant/:merchant', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {merchant} = req.params
    const {user} = req
    const favourites = await controller.addFavourite(user, merchant)
    return res.status(200).json(favourites)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removeFavourite
 * Removes favourite merchant from the user.
 */
router.post('/favourites/merchant/:merchant', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {merchant} = req.params
    const {user} = req
    const favourites = await controller.removeFavourite(user, merchant)
    return res.status(200).json(favourites)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listFavourites
 * List favourite merchants from the user.
 */
router.get('/favourites/merchants', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const favourites = await controller.getFavourites(user)
    return res.status(200).json(favourites)
  } catch (e) {
    error(e)
  }
})

export default router
