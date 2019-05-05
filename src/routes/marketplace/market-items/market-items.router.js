/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('market-items')
const controller = require('./market-items.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface save
 * Adds item to the catalogue.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let itemInfo = req.body
    let item = await controller.save(user, itemInfo)
    return res.status(200).json(item)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getById
 * Gets the market item by id.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id
    let item = await controller.get(id)
    return res.status(200).json(item)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getBySlug
 * Gets the market item by slug.
 */
router.get('/by-slug/:slug', async (req, res, error) => {
  try {
    let slug = req.params.slug
    let item = await controller.getBySlug(slug)
    return res.status(200).json(item)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface accept
 * Updates the item status to "accepted".
 */
router.post('/:id/accept', async (req, res, error) => {
  try {
    let id = req.params.id
    let accepted = controller.accept(id)
    return res.status(200).json(accepted)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface reject
 * Updates the item status to "rejected".
 */
router.post('/:id/reject', async (req, res, error) => {
  try {
    let id = req.params.id
    let rejected = controller.reject(id)
    return res.status(200).json(rejected)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface deactivate
 * Deactivates the item based on the given _id.
 */
router.post('/deactivate/:id', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.id
    let deactivated = await controller.deactivate(id)
    return res.status(200).json(deactivated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface activate
 * Activates the item based on the given _id.
 */
router.post('/activate/:id', auth.isAdmin(), async (req, res, error) => {
  try {
    let id = req.params.id
    let activated = await controller.activate(id)
    return res.status(200).json(activated)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listPending
 * Lists pending items from the database.
 */
router.get('/filter/pending', auth.isAdmin(), async (req, res, error) => {
  try {
    let items = await controller.listPending()
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listAllItemsForCategory
 * Lists category items (including deactived items).
 */
router.get('/list/:category/as-admin', auth.isAdmin(), async (req, res, error) => {
  try {
    let user = req.user
    let category = req.params.category
    let paginate = req.query.page && req.query.pageSize
    let page = parseInt(req.query.page || 1) // Parses pagination current page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses pagination page size
    let exclude = req.query.exclude || [] // Gets the items that should be ignored by the query
    if (typeof exclude == 'object') exclude = Object.values(exclude) // In case the ignored items array comes in the wrong format
    let items = await controller.listByCategory(user, category, exclude, paginate, page, pageSize)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface listItemsForCategory
 * Lists category items (excluding deactived items).
 */
router.get('/list/:category', async (req, res, error) => {
  try {
    let user = req.user
    let category = req.params.category
    let paginate = req.query.page && req.query.pageSize
    let page = parseInt(req.query.page || 1) // Parses pagination current page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses pagination page size
    let exclude = req.query.exclude || [] // Gets the items that should be ignored by the query
    if (typeof exclude == 'object') exclude = Object.values(exclude) // In case the ignored items array comes in the wrong format
    let items = await controller.listByCategory(user, category, exclude, paginate, page, pageSize)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

module.exports = router
