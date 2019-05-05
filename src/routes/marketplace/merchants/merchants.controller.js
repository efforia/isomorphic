/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant controller.
 */

// --------------- Module Imports
import Merchant from './merchant.model'

import Order from '../orders/order.model'
import Inventory from '../inventories/inventory.model'
import Promotion from '../promotions/promotion.model'
import InventoryItem from '../inventories/inventory-item.model'
import PromotionsCtrl from '../promotions/promotions.controller'
import MarketItemCategory from '../market-item-categories/market-item-category.model'
import MarketItemCategoriesCtrl from '../market-item-categories/market-item-categories.controller'

// --------------- Module Variables
const DEFAULT_RADIUS = 100000

// --------------- Module Controller
const MerchantsCtrl = {
  details: async function(id, username) {
    let promotionItems, promotionCategories // Initializes promotion variables
    let byCriteria = username ? { username: username } : { _id: id } // Creates criteria
    let merchant = await Merchant.findOne(byCriteria, '-password -paymentData')
      .populate('paymentMethods')
      .lean() // Gets merchant details
    let inventoryItems = (await InventoryItem.find(
      { ownerId: merchant._id },
      'information -_id'
    )).map(item => item.information) // Gets inventory items for the given merchant
    let inventoryCategories = await MarketItemCategoriesCtrl.getCategoriesForItems(inventoryItems) // Gets the full inventory categories list
    let inventory = await MarketItemCategory.find({
      _id: { $in: inventoryCategories },
      isRoot: true
    })
      .populate('children')
      .lean() // Filters for the inventory root categories only
    let promotionRef = await PromotionsCtrl.get(merchant._id, 'active') // Checks if there is an active promotion
    inventory.map(category => {
      category.children = category.children.filter(
        child => inventoryCategories.indexOf(`${child._id}`) > -1
      )
    }) // Filters the root categories children accordingly
    inventory.sort((a, b) => (a.description ? a.description.localeCompare(b.description) : 0)) // Sorts the inventory categories alplhabetically
    inventory.forEach(category => {
      if (category.children)
        category.children.sort((a, b) => {
          return a.description ? a.description.localeCompare(b.description) : 0
        }) // Orders the category children alphabetically
    })
    if (promotionRef) {
      // In case there is an active promotion
      promotionItems = (await Promotion.findOne({ _id: promotionRef._id }).populate(
        'items'
      )).items.map(item => {
        return item.information
      }) // Gets promotion item catalogue refs
      promotionCategories = await MarketItemCategoriesCtrl.getCategoriesForItems(promotionItems) // Gets the promotion categories
      inventory.map(category => {
        category.isOnPromotion = promotionCategories.indexOf(category._id + '') > -1
      }) // Sets the promotion flag on the category
      inventory.map(category => {
        category.children.map(
          subcategory =>
            (subcategory.isOnPromotion = promotionCategories.indexOf(subcategory._id + '') > -1)
        ) // Sets the promotion flag on the subcategories
      })
    }
    let details = merchant ? Object.assign(merchant, { inventory: inventory }) : {} // Adds the inventory to the merchant details
    return details // Returns it
  },

  updateRating: async function(id) {
    let orders = await Order.find(
      { merchant: id, 'ratings.customerRate': { $ne: null } },
      '-_id ratings.customerRate'
    ) // Gets merchant orders
    let ratingsTotal = 0 // Initializes rating count
    orders.map(order => {
      ratingsTotal += order.ratings.customerRate
    }) // Calculates the rating amount
    let rating = ratingsTotal / orders.length // Divides it by the ratings number
    let merchant = await Merchant.findOneAndUpdate({ _id: id }, { rating: rating }) // Updates it on the the merchant
    return merchant // Returns the updated merchant
  },

  nearby: async function(params) {
    let merchants = [] // Initializes the merchants array
    let point = { coordinates: [params.longitude, params.latitude], type: 'Point' } // Formats the coordinates object
    let query = {
      $geoNear: {
        query: params.criteria,
        near: point,
        distanceMultiplier: 0.001,
        spherical: true,
        lean: true,
        distanceField: 'distance'
      }
    } // Sets the query parameters
    if (params.radius) query.maxDistance = params.radius // Sets the radius for the query
    let results = await Merchant.aggregate([query]) // Searches for the nearby merchants
    results.map(result => {
      result.distance = result.distance.toFixed(1)
      return result
    }) // Adds the distance to the results
    return results // Returns nearby merchants list
  },

  nearbyMerchants: async function(latitude, longitude, radius, keyword) {
    keyword = new RegExp(keyword) // Creates keyword regex
    let params = {
      // Inializes database query parameters
      latitude: parseFloat(latitude) || 0, // Query latitude
      longitude: parseFloat(longitude) || 0, // Query longitude
      // radius: (parseInt(query.radius) || DEFAULT_RADIUS), // Query max distance
      criteria: { __t: 'Merchant', name: { $regex: keyword, $options: 'i' } } // Query keyword
    }
    let merchants = await MerchantsCtrl.nearby(params) // Searches for nearby merchants with the given criteria
    let filtered = [] // Initializes filtered array
    let isOpen,
      date = new Date(),
      today = date.getDay(),
      hours = date.getHours(),
      minutes = date.getMinutes(), // Initializes date, time and operation information
      now = `${hours}:${minutes}`,
      workingDay,
      closedForLunch,
      lunchStart = '12:00',
      lunchEnd = '13:00' // In order to check if the merchant is operating right now
    await Promise.all(
      merchants.map(async merchant => {
        // For each merchant
        if (merchant) {
          // In case it is not null nor undefined
          workingDay = merchant.operation.days[today] // Gets the today operation schedule
          closedForLunch = merchant.operation.closesForLunch
            ? now < lunchStart || now > lunchEnd
            : false // Checks if is not closed for lunch
          merchant.isOpen = workingDay
            ? workingDay.opening < now && workingDay.closing > now && !closedForLunch
            : false // Checks if the time is within the operation time range
          let inventory = await Inventory.findOne({ ownerId: merchant._id }) // Gets the inventory
          let promotion = await PromotionsCtrl.getActive(merchant._id) // Gets the promotion
          if (promotion) merchant.isOnPromotion = promotion.items.length > 0
          if (inventory && inventory.items.length > 0) filtered.push(merchant) // In case the merchant has any inventory items, adds it to the list
        }
      })
    )
    return filtered // Returns filtered list
  },

  nearbyByService: async function(service, latitude, longitude, radius, keyword) {
    let parameters = {
      // Sets the query parameters
      radius: DEFAULT_RADIUS || parseInt(radius), // Query max distance
      latitude: 0 || parseFloat(latitude), // Query latitude
      longitude: 0 || parseFloat(longitude), // Query longitude
      keyword: '' || keyword // Query keyword
    }
    parameters.criteria = { services: { $elemMatch: { description: service } } } // Query service type
    return (await MerchantsCtrl.nearby(parameters, '_id')) || [] // Returns nearby merchants
  }
}
export default MerchantsCtrl
