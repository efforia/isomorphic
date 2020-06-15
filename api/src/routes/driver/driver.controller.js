/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Driver controller.
 */

// --------------- Module Imports
import Driver from './driver.model'
import User from '../user/user.model'
import Order from '../order/order.model'
import DataService from '../../services/data.service'

// --------------- Module Variables
const DEFAULT_RADIUS = 100000

// --------------- Module Controller
const DriversCtrl = {
  create: async information => {
    const result = await Driver.findOne({ email: information.email }) // Tries to locate user
    if (result) throw new Error('DUPLICATED_USER') // In case it already exists, return error
    if (information.phone)
      information.formattedPhone = DataService.formatPhoneNumber(information.phone, 'BR') // Formats phone number
    const created = await Driver.create(information) // Creates user on the database
    const user = created.toObject() // Turns user object into editable object
    return Object.assign(user, { token: User.getTokenFor(user) }) // Returns the created user
  },

  read: async (id, username) => {
    const byCriteria = username ? { username } : { _id: id } // Creates criteria
    const user = await Driver.findOne(byCriteria, '-password -paymentData')
      .populate('paymentMethods')
      .lean() // Gets user details
    return user // Returns it
  },

  updateRating: async id => {
    const orders = await Order.find(
      { driver: id, 'ratings.customerRate': { $ne: null } },
      '-_id ratings.customerRate'
    ) // Gets driver orders
    let ratingsTotal = 0 // Initializes rating count
    orders.forEach(order => {
      ratingsTotal += order.ratings.customerRate
    }) // Calculates the rating amount
    const rating = ratingsTotal / orders.length // Divides it by the ratings number
    const driver = await Driver.findOneAndUpdate({ _id: id }, { rating }) // Updates it on the the driver
    return driver // Returns the updated driver
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
    const results = await Driver.aggregate([query]) // Searches for the nearby drivers
    results.map(result => {
      result.distance = result.distance.toFixed(1)
      return result
    }) // Adds the distance to the results
    return results // Returns nearby drivers list
  },

  nearbyDrivers: async (latitude, longitude, radius, keyword) => {
    const keywordRegexp = new RegExp(keyword) // Creates keyword regex
    const params = {
      // Inializes database query parameters
      latitude: parseFloat(latitude) || 0, // Query latitude
      longitude: parseFloat(longitude) || 0, // Query longitude
      // radius: (parseInt(query.radius) || DEFAULT_RADIUS), // Query max distance
      criteria: { __t: 'Driver', name: { $regex: keywordRegexp, $options: 'i' } } // Query keyword
    }
    const drivers = await DriversCtrl.nearby(params) // Searches for nearby drivers with the given criteria
    return drivers // Returns filtered list
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
    return (await DriversCtrl.nearby(parameters, '_id')) || [] // Returns nearby drivers
  }
}
export default DriversCtrl
