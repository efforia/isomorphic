// define models =========================================================
const Promotion = require('./promotion.model')
const PromotionItem = require('./promotion-item.model')
const Merchant = require('../merchants/merchant.model')
const MarketItem = require('../market-items/market-item.model')
const MarketItemCategory = require('../market-item-categories/market-item-category.model')
const MarketItemCategoriesCtrl = require('../market-item-categories/market-item-categories.controller')

const PromotionsCtrl = (module.exports = {
  save: async function(merchant, promotionInfo) {
    let activePromotion = await Promotion.findOne({
      ownerId: merchant._id,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() }
    }) // Queries for the active promotion
    if (!activePromotion) {
      // In case there is no active promotion, it can be created
      return await Promotion.create(Object.assign(promotionInfo, { ownerId: merchant._id })) // Creates the promotion
    } else {
      // Otherwise, tries to update it
      return await PromotionsCtrl.tryToSave(activePromotion, promotionInfo) // Calls conditional update
    }
  },
  tryToSave: async function(activePromotion, promotion) {
    // Tries to update an promotion
    let isUpdate = activePromotion._id + '' === promotion._id + ''
    if (isUpdate) {
      // In case the promotion is within an valid period of time
      delete promotion.createdAt // Removes timestamps in order to prevent conflicts
      delete promotion.updatedAt // Removes timestamps in order to prevent conflicts
      delete promotion.__v // Removes versioning in order to prevent conflicts
      return await Promotion.findOneAndUpdate({ _id: activePromotion._id }, promotion, {
        new: true
      }) // In case the promotion can be edited
    } else {
      // Only one promotion per merchant can exist at the time
      throw new Error(`Whoops! You can only create one active promotion per time )`)
    }
  },
  getActive: async function(merchant) {
    return await Promotion.findOne({
      ownerId: merchant,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() }
    }).lean() // Return the currently active promotion
  },
  get: async function(merchant, id) {
    return id == 'active'
      ? await PromotionsCtrl.getActive(merchant)
      : await Promotion.findOne({ _id: id }).lean() // Returns promotion information by id or active status
  },
  remove: async function(merchant, id) {
    let deleted = await Promotion.remove({ _id: id }) // Gets the promotion information
    let items = await PromotionItem.remove({ ownerId: id }) // Gets the promotion items
    return deleted // Returns the promotion with items
  },
  read: async function(merchant, id) {
    let promotion = await PromotionsCtrl.get(merchant, id) // Gets the promotion information
    let items = await PromotionItem.find({ ownerId: id }) // Gets the promotion items
    promotion = promotion ? Object.assign(promotion, items) : {} // Assigns the items to the promotion object
    return promotion // Returns the promotion with items
  },
  list: async function(merchant) {
    let active = await Promotion.find({
      ownerId: merchant._id,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() }
    }) // Gets all the active promotions
    let history = await Promotion.find({
      ownerId: merchant._id,
      startsAt: { $lte: new Date() },
      endsAt: { $lte: new Date() }
    }) // Gets all the inactive promotions
    return { active: active, inactive: history } // Returns both lists to the front end
  },
  formatItem: async function(merchant, id, item) {
    // Formats the item information sent by the client side
    let promotion = await Promotion.findOne({ _id: id }).lean() // Gets promotion information
    let items = await PromotionItem.find({ ownerId: promotion._id }).lean() // Gets promotion items list
    item.isNew = item.parentType !== 'Promotion' // Checks if the item must be created
    if (item.isNew) {
      item.information = item.information._id // Preserves the catalogue reference
      items.map(promotionItem => {
        // In order to avoid duplicated items
        if (promotionItem && promotionItem.inventoryRef && promotionItem.inventoryRef == item._id) {
          // In case the item is duplicated
          item.isDuplicated = true // Sets the duplication flag
          item._id = promotionItem._id // Sets the item id to the existing one
        }
      })
      item.parentType = 'Promotion' // Converts the info into an promotion item
      item.inventoryRef = item._id // Preserve the inventory item reference
      item.ownerId = merchant._id // Item belongs to the session merchant
      item.promotion = id // Item belongs to the specified promotion
      if (!item.isDuplicated) delete item._id // In case the item is not duplicated, create it
    }
    return item
  },
  saveMarketItem: async function(merchant, promotion, category, item) {
    let itemInfo = await PromotionsCtrl.formatItem(merchant, promotion, item) // Formats the item information
    if (itemInfo.isNew) item = await PromotionItem.create(itemInfo)
    // Creates if it does not exists
    else item = await PromotionItem.findOneAndUpdate({ _id: itemInfo._id }, itemInfo, { new: true }) // Updates the item if it exists
    promotion = await Promotion.findOneAndUpdate(
      { _id: promotion },
      { $addToSet: { items: item._id } },
      { new: true }
    ).populate('items') // Adds it to the pomotion
    let items = await PromotionsCtrl.getCategoryItems({
      merchant: merchant._id,
      id: promotion._id,
      category: category
    }) // Retrieves the updated items list
    return items // Returns the updated items list
  },
  removeMarketItem: async function(merchant, promotion, category, item) {
    let deleted = await PromotionItem.remove({ _id: item._id }) // Removes the item from the collection
    promotion = await Promotion.findOneAndUpdate(
      { _id: promotion },
      { $pull: { items: item._id } },
      { new: true }
    ) // Removes the item from the promotion
    let items = await PromotionsCtrl.getCategoryItems({
      merchant: merchant._id,
      id: promotion._id,
      category: category
    }) // Retrieves the updated items list
    return items // Returns the updated items list
  },
  getCategoryChildren: async function(promotionId, merchant, categorySlug) {
    let promotion = await PromotionsCtrl.get(merchant, promotionId) // Retrieves the promotion info
    if (!promotion) return {} // In case there is no promotion, exit function
    let promotionItems = await PromotionItem.find({ promotion: promotion })
      .distinct('information')
      .lean() // Retrieves the promotion items
    let promotionCategories = await MarketItemCategoriesCtrl.getCategoriesForItems(promotionItems) // Retrieves the promotion categories
    let category = await MarketItemCategory.findOne({ slug: categorySlug }).lean() // Filters for the current category information
    if (category)
      category.children = await MarketItemCategory.find({
        _id: { $in: promotionCategories },
        parent: category._id
      }).lean() // In case the category is found, appends the children
    if (category.children)
      category.children.map(child => {
        child._id = '' + child._id
        return child
      }) // Stringify the _id for comparison
    if (category.children)
      category.children.sort((a, b) => {
        return a.description ? a.description.localeCompare(b.description) : 0
      }) // Orders the category children alphabetically
    return category // Returns category with children
  },
  getCategoryItems: async function(params) {
    let emptyCategory = { items: [] } // Defines empty object to be returned in case of errors
    byUsername = await Merchant.findOne({ username: params.merchant })
    params.merchant = byUsername ? byUsername._id : params.merchant
    let promotion = await PromotionsCtrl.get(params.merchant, params.id) // Gets either the active promotion or the one specified by id
    if (!promotion) return emptyCategory // In case the promotion is not found, returns empty object
    let category = await MarketItemCategory.findOne({ slug: params.category }) // Retrieves the category data
    let categoryItems = await MarketItem.find({
      status: 'active',
      fullCategoriesList: { $in: [category._id] }
    })
      .lean()
      .distinct('_id') // Retrieves the market item ids
    let items = await PromotionItem.find({
      promotion: promotion._id,
      information: { $in: categoryItems }
    })
      .populate('inventoryRef information')
      .lean() // Parses the promotion items based on the ids
    items.map(item => {
      if (item.inventoryRef) item.price = item.inventoryRef.price
    }) // Gets the original price and adds it the items
    promotion = promotion ? Object.assign(promotion, { items: items }) : emptyCategory // Combines the promotion with the items
    return promotion // Returns the promotion category items
  },
  getAllItems: async function(params) {
    let emptyCategory = { items: [] } // Defines empty object to be returned in case of errors
    byUsername = await Merchant.findOne({ username: params.merchant })
    params.merchant = byUsername ? byUsername._id : params.merchant
    let promotion = await PromotionsCtrl.get(params.merchant, params.id) // Gets either the active promotion or the one specified by id
    if (!promotion) return emptyCategory // In case the promotion is not found, returns empty object
    let items = await PromotionItem.find({
      promotion: promotion._id
    })
      .populate('inventoryRef information')
      .lean() // Parses the promotion items based on the ids
    items.map(item => {
      if (item.inventoryRef) item.price = item.inventoryRef.price
    }) // Gets the original price and adds it the items
    promotion = promotion ? Object.assign(promotion, { items: items }) : emptyCategory // Combines the promotion with the items
    return promotion // Returns the promotion category items
  }
})
