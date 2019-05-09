/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Lead routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './lead.controller'
import auth from '../../services/auth.service'

const router = express.Router('leads')

router.post('/', async (req, res, error) => {
  try {
    const lead = req.body
    const saved = await controller.save(lead)
    return res.status(200).json(saved)
  } catch (e) {
    error(e)
  }
})

router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const leads = await controller.list()
    return res.status(200).redirect(leads)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const { id } = req.params
    const leads = await controller.get(id)
    return res.status(200).redirect(leads)
  } catch (e) {
    error(e)
  }
})

export default router
