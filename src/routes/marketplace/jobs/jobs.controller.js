/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Service provision controller.
 */

// --------------- Module Imports
import Job from './job.model'

import Order from '../orders/order.model'
import MerchantCtrl from '../merchants/merchants.controller'
import NotificationsCtrl from '../../notifications/notifications.controller'

// --------------- Module Controller
const JobsCtrl = {
  requestNearby: async function(user, service, latitude, longitude, radius, keyword) {
    let merchants = await MerchantCtrl.nearbyByService(
      service,
      latitude,
      longitude,
      radius,
      keyword
    ) // Retrieves the nearby merchants
    let merchant = merchants[0] // Gets the first merchant
    if (!(merchants.length > 0))
      throw new Error(
        'Whoops! We were unable to find any merchants based on the provided criteria :('
      ) // In case there ano avaialable merchants, returns error
    await NotificationsCtrl.send({
      // Sends an notification
      contents: 'Novo pedido de ' + user.name, // Information about the new order
      data: { event: 'service_requested', user: user._id }, // With the new order event
      to: [merchant._id] // And the destinataries ids
    })
    let order = await Order.create({
      // Creates the order
      customer: user, // With the customer
      merchant: merchant, // The merchant
      items: [{ service: service }] // And the service requested
    })
    return { order: order, merchants: merchant } // Returns the created order
  },
  getByMerchant: async function(merchant) {
    return await Job.find({ merchant: merchant._id }) // Returns the jobd events
  }
}
export default JobsCtrl
