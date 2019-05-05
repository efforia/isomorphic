/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Order controller.
 */

// --------------- Module Imports
import currencyFormatter from 'currency-formatter'

import Order from './order.model'
import User from '../../users/user.model'
import ReceivingMode from './receiving-mode.model'
import Notification from '../../notifications/notification.model'
import EmailsCtrl from '../../../services/emails/emails.controller'
import MerchantCtrl from '../merchants/merchants.controller'
import OrderRefsCtrl from '../../payments/order-references/order-references.controller'
import socket from '../../../services/socket.service'

const locales = {}

// --------------- Module s
const pad = num => {
  const parsed = parseInt(num, 10)
  return parsed < 10 ? `0${parsed.toString()}` : parsed.toString()
}

// --------------- Module controller
const OrdersCtrl = {
  create: async (user, order) => {
    let gatewayInfo = {} // Declares  variables
    const isGatewayPayment = order && order.paymentInstrument && order.paymentInstrument.first4 // Checks if order is payed by the app
    const amount = await OrdersCtrl.calculateAmount(order) // Gets order total amount
    const merchant = await User.findOne({ _id: order.merchant }) // Gets order merchant
    let createdOrder = await Order.create(Object.assign(order, amount)) // Assigns the amount calculated to the order
    if (isGatewayPayment)
      gatewayInfo = await OrderRefsCtrl.createPayment(order, user.payment.customer, merchant) // Creates payment if needed
    createdOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      { isGatewayPayment, gatewayInfo }
    ).populate('items.information') // Sets payment information and saves the order
    await OrdersCtrl.notifyUsersAbout(createdOrder) // Sends notification to the related users about the order
    return order // Returns the created order to the front end
  },
  notifyUsersAbout: async order => {
    const parsedOrder = await OrdersCtrl.format(order.toObject()) // Formats order properly
    const merchant = await User.findOne({ _id: parsedOrder.merchant }) // Gets order merchant
    const customer = await User.findOne({ _id: parsedOrder.customer }) // Gets order customer
    const options = { parsedOrder, customer, merchant } // Sets order information for the notification
    switch (
      parsedOrder.status // Based on the order status
    ) {
      case 'created': // In case the order has just been created
        options.orderStatus = locales.created_order // Sends the order status locale
        options.title = locales.you_have_received_a_new_order // With the order status title
        options.message = locales
          .get('you_have_received_a_new_order_message')
          .replace('CUSTOMER_NAME', customer.name.split(' ')[0]) // And the information about the order status update
        options.orderEvent = 'new order' // And the push notification/socket event
        options.to = merchant // To the merchant
        options.user = customer // From the customer
        break
      case 'accepted': // In case the order has been accepted by the merchant
        options.orderStatus = locales.accepted_order // Sends the order status locale
        options.title = locales.your_order_has_been_confirmed // With the order status title
        options.message = locales.your_order_has_been_confirmed_message.replace(
          'MERCHANT_NAME',
          merchant.name
        ) // And the information about the order status update
        options.orderEvent = 'order review' // And the push notification/socket event
        options.to = customer // To the customer
        options.user = merchant // From the merchant
        break
      case 'canceled': // In case the order has been cancelled by the merchant
        options.orderStatus = locales.canceled_order // Sends the order status locale
        options.title = locales.your_order_has_been_canceled // With the order status title
        options.message = locales.your_order_has_been_canceled_message.replace(
          'MERCHANT_NAME',
          merchant.name
        ) // And the information about the order status update
        options.orderEvent = 'order review' // And the push notification/socket event
        options.to = customer // To the customer
        options.user = merchant // From the merchant
        break
      default:
        break
    }
    const notification = await Notification.create({
      // Creates the notification
      title: options.title, // With the provided title
      to: options.to._id, // With the provided destinatary
      pictureUrl: `${process.env.SERVER_ADDRESS}/picture/${options.to._id}`, // With the user picture
      data: { order: order._id } // And the order information
    })
    socket.emit(options.orderEvent, Object.assign({ room: options.to._id }, notification)) // Sends the notification
    return OrdersCtrl.sendOrderMail(order, options) // And the order e-mail
  },
  sendOrderMail: async (order, options) => {
    const mail = {
      // Intializes the e-mail
      from: `${process.env.PROJECT_DISPLAY_NAME} <${process.env.PROJECT_CONTACT_EMAIL}>`, // From the project mailer account
      subject: `${options.title}`, // With the order update proper title
      template: 'order-update', // Using the generic order update template
      to: [options.to.email, process.env.PROJECT_ACCOUNTS_EMAIL], // To the destinatary and the project admin
      context: Object.assign(options, {
        // With the context variables
        items: options.order.items, // Inclusding the items
        user: options.user, // The user that triggered the action
        viewerIsMerchant: options.to.__t === 'Merchant', // In case the e-mail receiver will be a merchant
        viewerIsCustomer: options.to.__t === 'Customer', // In case the e-mail receiver will be a customer
        orderLink: `${process.env.SERVER_ADDRESS}/#/order-details/${order._id}` // And, of course, the order link
      })
    }
    return EmailsCtrl.send(mail) // Sends the e-mail and returns it
  },
  cancel: async id => {
    const order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status: 'canceled' } }
    ).populate('customer merchant items.information') // Sets the status as cancelled
    await OrdersCtrl.notifyUsersAbout(order) // Notifties the users about it
    return order // Returns the cancelled order
  },
  accept: async (user, id) => {
    const merchant = user // Gets the session user
    let order = await Order.findOne({ _id: id }).populate('customer merchant items.information') // Gets the order information
    if (order.isGatewayPayment) {
      // In case the order payment is going through the payments gateway
      await OrderRefsCtrl.authorizePayment(id)
    }
    order = await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status: 'accepted', merchant: merchant._id, acceptedAt: new Date() } },
      { new: true }
    ).populate('customer merchant items.information') // Updates order
    await OrdersCtrl.notifyUsersAbout(order) // Notifies users
    return order // Returns order
  },

  rate: async (user, id, rate) => {
    const ratings = {} // Initializes ratings object
    const role = user.__t // Checks user role
    if (role === 'Merchant') ratings.merchantRate = rate
    // Merchant rating the user
    else ratings.customerRate = rate // User rating the merchant
    const order = await Order.findOneAndUpdate({ _id: id }, { ratings }, { new: true }) // Customer rating update
    if (role === 'Customer') MerchantCtrl.updateRating(order.merchant) // Merchant rating update
    return order // Returns confirmation
  },
  getOrdersByUserId: async (user, status) => {
    const criteria = { $or: [{ customer: user }, { merchant: user }] } // Gets orders for customers and merchants conditionally
    if (status) Object.assign(criteria, { status }) // Filter for order status if required
    const orders = await Order.find(criteria)
      .sort({ createdAt: -1 })
      .populate('customer merchant items.information')
      .lean() // Gets orders list
    return orders // Returns orders list
  },
  getOrdersByDatesAndUserId: async (user, startDate, endDate, status) => {
    const userId = user._id // Gets session user
    const criteria = { $or: [{ customer: userId }, { merchant: userId }] } // Initializes query criteria
    if (status) Object.assign(criteria, { status }) //  Filter for order status if required
    Object.assign(criteria, {
      $and: [
        { createdAt: { $gte: new Date(startDate) } },
        { createdAt: { $lte: new Date(endDate) } }
      ]
    })
    const dates = []
    let date
    ;(await Order.aggregate([
      {
        // Group orders by date
        $match: criteria
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          }, // For every id, get year, month and day
          count: { $sum: 1 } // And add an count variable to it
        }
      }
    ])).forEach(x => {
      // For every date
      date = x._id // Gets the date with year, month and day properties
      dates.push({
        date: `${pad(date.day)}/${pad(date.month)}`, // Generates the label as (DD-MM)
        count: x.count // Gets the date orders count
      }) //  Sets it on the dates object
    })
    return dates // Returns the formatted dates
  },
  getById: async (user, id) => {
    const requesterIsCustomer = user.roles.indexOf('CUSTOMER') > -1 // Checks which is the user role
    const order = await Order.findOne({ _id: id })
      .populate('customer merchant items.information')
      .lean() // Gets the order
    order.ratings = order.ratings || {} // Gets the order ratings
    order.rating = requesterIsCustomer ? order.ratings.customerRate : order.ratings.merchantRate // Filters the rating by user role
    if (order.isGatewayPayment) order.paymentInfo = await OrderRefsCtrl.getPayment(id)
    delete order.ratings // Deletes original ratings property
    return order // Returns order
  },
  getOrdersByDates: async (merchant, startDate, endDate) => {
    const orders = await Order.find({
      merchant: merchant._id,
      $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }]
    }) // Gets orders within specified time range
      .sort({ createdAt: -1 })
      .populate('customer merchant items.information')
      .lean() // And sorted by date
    return orders // Returns the orders
  },
  listReceivingModes: async () => ReceivingMode.find({}), // Returns order receiving modes
  calculateAmount: async data => {
    let subtotal = 0.0 // Declares subtotal variable
    const items = data.items || []
    items.forEach(item => {
      // For each order item
      item.total = (item.discountPrice || item.price) * item.quantity // Adds the item price multiplied by the item quantity
      subtotal += item.total // And adds it to the subtotal (items price only, not including taxes, delivery, etc.)
    })
    const amount = { subtotal } // Declares amount object
    if (data.receivingMode === 'DELIVERY') {
      // In case the order have delivery taxes
      const merchant = await User.findOne({ _id: data.merchant }) // Gets the merchant data
      amount.deliveryTax = merchant.delivery.tax // Sets the delivery tax
    }
    amount.total = subtotal + (amount.deliveryTax || 0.0) // Sums up the subtotals
    return amount // Return amount
  },
  format: async order => {
    order.items.forEach(item => {
      // For every item
      item.discountPrice = currencyFormatter.format(item.discountPrice, { locale: 'pt-BR' }) // Formats as locale currency
      item.price = currencyFormatter.format(item.price, { locale: 'pt-BR' }) // Formats as locale currency
      item.total = currencyFormatter.format(item.total, { locale: 'pt-BR' }) // Formats as locale currency
    })
    order.total = currencyFormatter.format(order.total, { locale: 'pt-BR' }) // Formats as locale currency
    order.subtotal = currencyFormatter.format(order.subtotal, { locale: 'pt-BR' }) // Formats as locale currency
    order.deliveryTax = currencyFormatter.format(order.deliveryTax, { locale: 'pt-BR' }) // Formats as locale currency
    order.updated = order.createdAt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) // Formats as locale time
    order.receivingMode = locales.order.receivingMode // Sets the proper locale
    order.paymentInstrument = order.paymentInstrument.hash
      ? locales.via_app
      : order.paymentInstrument.label // Sets the proper locale
    return order // Returns formatted order
  }
}
export default OrdersCtrl
