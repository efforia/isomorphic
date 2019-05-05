/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant controller.
 */

// --------------- Module Imports
import Merchant from './merchant.model'
import Order from '../orders/order.model'

// --------------- Module Variables
const DEFAULT_RADIUS = 100000

// --------------- Module Controller
const MerchantsCtrl = {
  details: async (id, username) => {
    const byCriteria = username ? { username } : { _id: id } // Creates criteria
    const merchant = await Merchant.findOne(byCriteria, '-password -paymentData')
      .populate('paymentMethods')
      .lean() // Gets merchant details
    const details = merchant || {} // Adds the inventory to the merchant details
    return details // Returns it
  },

  updateRating: async id => {
    const orders = await Order.find(
      { merchant: id, 'ratings.customerRate': { $ne: null } },
      '-_id ratings.customerRate'
    ) // Gets merchant orders
    let ratingsTotal = 0 // Initializes rating count
    orders.forEach(order => {
      ratingsTotal += order.ratings.customerRate
    }) // Calculates the rating amount
    const rating = ratingsTotal / orders.length // Divides it by the ratings number
    const merchant = await Merchant.findOneAndUpdate({ _id: id }, { rating }) // Updates it on the the merchant
    return merchant // Returns the updated merchant
  },

  nearby: async params => {
    const point = { coordinates: [params.longitude, params.latitude], type: 'Point' } // Formats the coordinates object
    const query = {
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
    const results = await Merchant.aggregate([query]) // Searches for the nearby merchants
    results.map(result => {
      result.distance = result.distance.toFixed(1)
      return result
    }) // Adds the distance to the results
    return results // Returns nearby merchants list
  },

  nearbyMerchants: async (latitude, longitude, radius, keyword) => {
    const keywordRegexp = new RegExp(keyword) // Creates keyword regex
    const params = {
      // Inializes database query parameters
      latitude: parseFloat(latitude) || 0, // Query latitude
      longitude: parseFloat(longitude) || 0, // Query longitude
      // radius: (parseInt(query.radius) || DEFAULT_RADIUS), // Query max distance
      criteria: { __t: 'Merchant', name: { $regex: keywordRegexp, $options: 'i' } } // Query keyword
    }
    const merchants = await MerchantsCtrl.nearby(params) // Searches for nearby merchants with the given criteria
    return merchants // Returns filtered list
  },

  nearbyByService: async (service, latitude, longitude, radius, keyword) => {
    const parameters = {
      // Sets the query parameters
      radius: DEFAULT_RADIUS || parseInt(radius, 10), // Query max distance
      latitude: 0 || parseFloat(latitude), // Query latitude
      longitude: 0 || parseFloat(longitude), // Query longitude
      keyword: '' || keyword // Query keyword
    }
    parameters.criteria = { services: { $elemMatch: { description: service } } } // Query service type
    return (await MerchantsCtrl.nearby(parameters, '_id')) || [] // Returns nearby merchants
  }
}
export default MerchantsCtrl
