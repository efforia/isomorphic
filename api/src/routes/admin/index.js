/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Admin routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './admin.controller'
import auth from '../../services/auth.service'

const router = express.Router('admin')
/**
 * @interface listUsers
 * Lists users including the deleted ones.
 */
router.get('/users', auth.isAdmin(), async (req, res, error) => {
  try {
    const page = parseInt(req.query.page || 1, 10) // Parses the page
    const pageSize = parseInt(req.query.pageSize || 5, 10) // Parses the page size
    const keyword = req.query.keyword || '' // Parses the filtering keyword
    const { role } = req.query
    const { user } = req._id
    const users = await controller.listUsers(user, role, keyword, page, pageSize)
    return res.status(200).json(users)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface deactivateUser
 * Performs logic exclusion on the user.
 */
router.post('/user/:id', auth.isAdmin(), async (req, res, error) => {
  try {
    const { id } = req.params
    const deactivated = await controller.deactivateUser(id)
    return res.status(200).json(deactivated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface activateUser
 * Performs logic activation on the user.
 */
router.post('/user/:id/activate', auth.isAdmin(), async (req, res, error) => {
  try {
    const { id } = req.params
    const activated = controller.activateUser(id)
    return res.status(200).json(activated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface changeUserRole
 * Changes user role.
 */
router.post('/user/:id/role', auth.isAdmin(), async (req, res, error) => {
  try {
    const { role, id } = req.params
    const updated = await controller.changeUserRole(id, role)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

export default router
