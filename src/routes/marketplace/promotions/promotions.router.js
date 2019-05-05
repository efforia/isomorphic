/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Promotion routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../../swagger/swagger.router'

import SwaggerUtils from '../../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('promotions')
import controller from './promotions.controller'
import auth from '../../../services/auth.service'

router.get('/', auth.isMerchant(), async (req, res, error) => {
  try {
    let merchant = req.user
    let promotions = await controller.list(merchant)
    return res.status(200).json(promotions)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface savePromotion
 * Saves promotion on the database.
 */
router.post('/', auth.isMerchant(), async (req, res, error) => {
  try {
    let merchant = req.user
    let promotionInfo = req.body
    let promotion = await controller.save(merchant, promotionInfo)
    return res.status(200).json(promotion)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removePromotion
 * Removes promotion from the database.
 */
router.post('/:id/delete', auth.isMerchant(), async (req, res, error) => {
  try {
    let merchant = req.user
    let promotionId = req.params.id
    let promotion = await controller.remove(merchant, promotionId)
    return res.status(200).json(promotion)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPromotion
 * Retrieves promotion information.
 */
router.get('/:id/:merchant', async (req, res, error) => {
  try {
    let merchant = req.params.merchant
    let id = req.params.id
    let promotion = await controller.read(merchant, id)
    return res.status(200).json(promotion)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPromotionCategory
 * Get children categories for the given category.
 */
router.get('/:id/:merchant/:category', async (req, res, error) => {
  try {
    let category = await controller.getCategoryChildren(
      req.params.id,
      req.params.merchant,
      req.params.category
    )
    return res.status(200).send(category)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPromotionItemsForCategory
 * Get inventory items within the given category.
 */
router.get('/:id/:merchant/:category/items/list', async (req, res, error) => {
  try {
    const params = req.params
    let items =
      params.category === 'todos'
        ? await controller.getAllItems(params)
        : await controller.getCategoryItems(params)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface addMarketItemToPromotion
 * Adds item to the promotion.
 */
router.post('/:id/:category/items/add', auth.isMerchant(), async (req, res, error) => {
  try {
    let item = req.body
    let merchant = req.user
    let promotion = req.params.id
    let category = req.params.category
    let items = await controller.saveMarketItem(merchant, promotion, category, item)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface defaultResponses
 * Removes item from the promotion.
 */
router.post('/:id/:category/items/remove', auth.isMerchant(), async (req, res, error) => {
  try {
    let item = req.body
    let merchant = req.user
    let promotion = req.params.id
    let category = req.params.category
    let items = await controller.removeMarketItem(merchant, promotion, category, item)
    return res.status(200).json(items)
  } catch (e) {
    error(e)
  }
})

export default router
