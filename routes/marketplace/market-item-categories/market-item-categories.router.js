/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item category routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('market-item-categories')
const controller = require('./market-item-categories.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface saveMarketItemCategory
 * Adds item category to the database.
 */
router.post('/', auth.isAdmin(), async (req, res, error) => {
  try {
    let categoryInfo = req.body
    let saved = await controller.save(categoryInfo)
    return res.status(200).json(saved)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listMarketItemCategories
 * List item categories from the database.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let categories = await controller.list(user)
    return res.status(200).json(categories)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listRootMarketItemCategories
 * List root item categories from the database.
 */
router.get('/root', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let categories = await controller.listRoot(user)
    return res.status(200).json(categories)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getMarketItemCategoryBySlug
 * Gets market item category by slug.
 */
router.get('/by-slug/:category', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let slug = req.params.category
    let category = await controller.getBySlug(user, slug)
    return res.status(200).json(category)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface deactivateMarketItemCategory
 * Deactivates market item category.
 */
router.post('/:categoryId/deactivate', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.categoryId
    let deactivated = await controller.deactivate(id)
    return res.status(200).json(deactivated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface activateMarketItemCategory
 * Activates market item category.
 */
router.post('/categories/:categoryId/activate', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.categoryId
    let activated = await controller.activate(id)
    return res.status(200).json(activated)
  } catch (e) {
    error(e)
  }
})

module.exports = router
