/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Admin routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../swagger/swagger.router'

import SwaggerUtils from '../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('admin')
import controller from './admin.controller'
import auth from '../../services/auth.service'

/**
 * @interface listUsers
 * Lists users including the deleted ones.
 */
router.get('/users', auth.isAdmin(), async (req, res, error) => {
  try {
    let page = parseInt(req.query.page || 1) // Parses the page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses the page size
    let keyword = req.query.keyword || '' // Parses the filtering keyword
    let role = req.query.role
    let user = req.user._id
    let users = await controller.listUsers(user, role, keyword, page, pageSize)
    return res.status(200).json(users)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface deactivateUser
 * Performs logic exclusion on the user.
 */
router.post('/users/:id', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.id
    let deactivated = await controller.deactivateUser(id)
    return res.status(200).json(deactivated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface activateUser
 * Performs logic activation on the user.
 */
router.post('/users/:id/activate', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.id
    let activated = controller.activateUser(id)
    return res.status(200).json(activated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface changeUserRole
 * Changes user role.
 */
router.post('/users/:id/role', auth.isAdmin(), async (req, res, error) => {
  try {
    let role = req.params.role // Parses the role
    let id = req.params.id
    let updated = await controller.changeUserRole(id, role)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

export default router
