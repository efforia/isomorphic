/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Service provision controller.
 */

// --------------- Module Imports
import Ride from './ride.model'

import Order from '../marketplace/orders/order.model'
import DriverCtrl from '../drivers/drivers.controller'
import NotificationsCtrl from '../notifications/notifications.controller'

// --------------- Module Controller
const RidesCtrl = {
  requestNearby: async (user, service, latitude, longitude, radius, keyword) => {
    const drivers = await DriverCtrl.nearbyByService(service, latitude, longitude, radius, keyword) // Retrieves the nearby drivers
    const driver = drivers[0] // Gets the first driver
    if (!(drivers.length > 0))
      throw new Error(
        'Whoops! We were unable to find any drivers based on the provided criteria :('
      ) // In case there ano avaialable drivers, returns error
    await NotificationsCtrl.send({
      // Sends an notification
      contents: `Novo pedido de ${user.name}`, // Information about the new order
      data: { event: 'service_requested', user: user._id }, // With the new order event
      to: [driver._id] // And the destinataries ids
    })
    const order = await Order.create({
      // Creates the order
      customer: user, // With the customer
      driver, // The driver
      items: [{ service }] // And the service requested
    })
    return { order, drivers: driver } // Returns the created order
  },
  getByDriver: async driver => Ride.find({ driver: driver._id }) // Returns the rided events
}
export default RidesCtrl
