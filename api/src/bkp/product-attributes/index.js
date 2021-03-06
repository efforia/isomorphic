/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './product-attribute.controller'
import auth from '../../../services/auth.service'


const router = express.Router('product-attributes')

/**
 * @interface save
 * Adds item attribute to the database.
 */
router.post('/', auth.isAdmin(), async (req, res, error) => {
  try {
    const attributeInfo = req.body
    const attribute = await controller.save(attributeInfo)
    return res.status(200).json(attribute)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface list
 * List item attributes from the database.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const attributes = await controller.list()
    return res.status(200).json(attributes)
  } catch (e) {
    error(e)
  }
})

export default router
