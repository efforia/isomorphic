/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('inventories')
const controller = require('./inventories.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface saveItem
 * Adds item to the inventory.
 */
router.post('/items', auth.isMerchant(), async (req, res, error) => {
  try {
    let itemInfo = req.body
    let merchant = req.user
    let item = await controller.saveItem(merchant, itemInfo)
    return res.status(200).json(item)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removeItem
 * Removes item from the inventory.
 */
router.post('/items/remove/:id', auth.isMerchant(), async (req, res, error) => {
  try {
    let id = req.params.id
    let user = req.user
    let deleted = await controller.removeItem(user, id)
    return res.status(200).json(deleted)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getItemsCount
 * Get items count on the inventory.
 */
router.get('/items/count', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let merchant = req.user
    let count = await controller.getItemsCount(merchant)
    return res.status(200).json(count)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getMerchantCategory
 * Get children categories for the given category.
 */
router.get('/:merchant/category/:category', async (req, res, error) => {
  try {
    let merchant = req.params.merchant // Gets the merchant id
    let category = req.params.category // Gets the category slug
    let categoryWithChildren = await controller.getCategoryChildren(merchant, category)
    return res.status(200).json(categoryWithChildren)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getInventoryItems
 * Get inventory items within the given category.
 */
router.get('/:merchant/items/list/:category', async (req, res, error) => {
  try {
    let merchant = req.params.merchant
    let category = req.params.category
    let page = req.query.page ? parseInt(req.query.page) : undefined // Parses the current pagination page
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : undefined // Parses the pagination page size
    let items =
      category === 'todos'
        ? await controller.getAllItems(merchant, category, page, pageSize)
        : await controller.getCategoryItems(merchant, category, page, pageSize)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

module.exports = router
