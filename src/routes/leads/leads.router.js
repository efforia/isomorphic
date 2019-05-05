/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Lead routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../swagger/swagger.router'

import SwaggerUtils from '../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('leads')
import controller from './leads.controller'
import auth from '../../services/auth.service'

router.post('/', async (req, res, error) => {
  try {
    let lead = req.body
    let saved = await controller.save(lead)
    return res.status(200).json(saved)
  } catch (e) {
    error(e)
  }
})

router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let leads = await controller.list()
    return res.status(200).redirect(leads)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let id = req.params.id
    let leads = await controller.get(id)
    return res.status(200).redirect(leads)
  } catch (e) {
    error(e)
  }
})

export default router
