/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory controller.
 */

// --------------- Module Imports
const Inventory = require('./inventory.model')
const InventoryItem = require('./inventory-item.model')
const Merchant = require('../merchants/merchant.model')
const MarketItem = require('../market-items/market-item.model')
const MarketItemCategory = require('../market-item-categories/market-item-category.model')
const MarketItemCategoryCtrl = require('../market-item-categories/market-item-categories.controller')
const PromotionCtrl = require('../promotions/promotions.controller')

// --------------- Module Controller
const InventoriesCtrl = (module.exports = {
  saveItem: async function(merchant, item) {
    delete item.__v // Removes version in order to prevent conflicts
    delete item.createdAt // Removes timestamp in order to prevent conflicts
    let itemInfo = await InventoriesCtrl.formatItem(merchant, item) // Formats the item
    item = await InventoryItem.findOneAndUpdate(
      { ownerId: merchant._id, information: itemInfo.information },
      { $set: itemInfo },
      { upsert: true, new: true }
    ).populate('information') // Updates the item if needed
    let addToInventory = !(await Inventory.findOne({
      ownerId: merchant._id,
      'items._id': item._id
    })) // Checks if the item does not exists on the inventory
    if (addToInventory)
      await Inventory.findOneAndUpdate(
        { ownerId: merchant._id },
        { $push: { items: item._id } },
        { upsert: true, new: true }
      ) // Adds the item to the inventory if needed
    return item // Returns the updated item
  },
  formatItem: async function(merchant, item) {
    let informationId = item.information._id // Sets the proper item information
    item.categories = item.information.categories // Sets the proper item categories
    item.information = informationId // Sets the proper item catalogue id
    item.ownerId = merchant._id // Sets the ownerId as the merchant id
    if (item._id == informationId) delete item._id // Deletes the original id to prevent duplications
    return item // Returns the formatted item
  },
  removeItem: async function(user, id) {
    let deleted = await InventoryItem.findOneAndRemove({ _id: id }) // Tries to the deleted the item
    if (deleted)
      await Inventory.findOneAndUpdate(
        { ownerId: user._id },
        { $pull: { items: deleted._id } },
        { new: true }
      ).populate('items.information') // If successfully deleted, removes it from the inventory
    return deleted // Returns the deleted item
  },
  getItemsCount: async function(merchant) {
    return (await InventoryItem.find({ ownerId: merchant._id })).length // Gets the inventory items count
  },
  getCategoryChildren: async function(merchant, categorySlug) {
    let inventory = await InventoryItem.find({ ownerId: merchant })
      .distinct('information')
      .lean() // Gets the inventory items
    let inventoryCategories = await MarketItemCategoryCtrl.getCategoriesForItems(inventory) // Gets the inventory categories
    category = await MarketItemCategory.findOne({ slug: categorySlug })
      .populate('children')
      .lean() // Gets the category information
    let promotion = await PromotionCtrl.getCategoryChildren('active', merchant, categorySlug) // Checks if there is any active promotions
    if (category)
      category.children = category.children.filter(child => {
        return inventoryCategories.indexOf(child._id + '') > -1
      }) // Sets the category children accordingly
    if (category.children)
      category.children.sort((a, b) => {
        return a.description ? a.description.localeCompare(b.description) : 0
      }) // Orders the category children alphabetically
    if (promotion && promotion.children && category)
      category.children.map(child => {
        child.isOnPromotion = promotion.children.indexOfObject('_id', '' + child._id) > -1
      }) // Sets the promotion flags if needed
    return category // Returns the inventory category with its children
  },
  getCategoryItems: async function(merchant, category, page, pageSize) {
    byUsername = await Merchant.findOne({ username: merchant })
    merchant = byUsername ? byUsername._id : merchant
    category = await MarketItemCategory.findOne({ slug: category }, 'description') // Retrieves the category information
    let categoryItems = (await MarketItem.find({
      fullCategoriesList: { $in: [category._id] }
    })).map(x => x._id) // Filters for the current category items only
    let inventory = await InventoryItem.find({
      information: { $in: categoryItems },
      ownerId: merchant
    })
      .populate('information')
      .exec() // Inits the inventory query
    inventory.sort((a, b) => {
      if (a.information.name < b.information.name) {
        return -1
      }
      if (a.information.name > b.information.name) {
        return 1
      }
      return 0
    })
    return { description: category.description, id: category._id, items: inventory } // Returns the inventory items
  },
  getAllItems: async function(merchant, category, page, pageSize) {
    byUsername = await Merchant.findOne({ username: merchant })
    merchant = byUsername ? byUsername._id : merchant
    let inventory = await InventoryItem.find({ ownerId: merchant })
      .populate('information')
      .exec() // Inits the inventory query
    inventory.sort((a, b) => {
      if (a.information.name < b.information.name) {
        return -1
      }
      if (a.information.name > b.information.name) {
        return 1
      }
      return 0
    })
    return { description: byUsername.name, id: byUsername._id, items: inventory } // Returns the inventory items
  }
})
