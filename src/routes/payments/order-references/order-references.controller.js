/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Order controller.
 */

// --------------- Module Imports
const Order = require('../../marketplace/orders/order.model')
const PaymentCtrl = require('../../payments/payments.controller.js')
const moment = require('moment')
const axios = require('axios')

// --------------- Module variables
const moip = require('moip-sdk-node').default({
  accessToken: process.env.MOIP_APP_TOKEN,
  production: false
})
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}
const MARKETPLACE_PERCENTAGE = 5

// --------------- Module functions
const pad = num => {
  num = parseInt(num)
  return num < 10 ? '0' + num.toString() : num.toString()
}

// --------------- Module controller
const OrderRefsCtrl = (module.exports = {
  createPayment: async function(orderInfo, customer, merchant) {
    customer = customer || {} // Prevents errors with the customer data
    if (!PaymentCtrl.MARKETPLACE_ID) await PaymentCtrl.init() // Initializes the marketplace id to prevent errors
    let data = {
      // Sets payment data
      ownId: orderInfo._id, // Order id on our database
      amount: { currency: 'BRL', subtotals: { shipping: 0 } }, // Order amount information
      items: [
        {
          // Order meta (goes into the NFe)
          product: process.env.PROJECT_DISPLAY_NAME, // Project name
          quantity: 1, // One quantity with the total order amount
          price: parseInt((orderInfo.total.toFixed(2) * 100).toFixed(0)) // Total order amount
        }
      ],
      customer: { id: customer.id } // And the payment gateway customer id
    }
    if (merchant) {
      // Splits the payment
      data.receivers = [
        // Payment receivers
        {
          // Merchant
          moipAccount: { id: merchant.payment.merchant.id }, // Receiver id
          amount: { percentual: 100 - MARKETPLACE_PERCENTAGE }, // Receiver percentage
          type: 'SECONDARY', // Receiver type (PRIMARY or SECONDARY)
          feePayor: true // Sets the fee payor tag
        }
      ]
    }
    const response = await moip.order.create(data) // Creates the order on the payment gateway
    return response.body // Returns the created order
  },
  authorizePayment: async function(id) {
    let order = await Order.findOne({ _id: id }).populate('customer merchant items.information') // Gets the order information
    let holder = order.customer.payment.customer // Gets the customer information
    holder.birthdate = holder.birthDate // Gets the customer birth date
    let paymentInstrument,
      confirmation,
      isCreditCardPayment = order.paymentInstrument.first4
    if (isCreditCardPayment) {
      paymentInstrument = {
        // In case the payment instrument is a credit card
        installmentCount: order.installments || 1, // Installments count (1 by default)
        delayCapture: false, // Do not delay capture (process payment right away)
        fundingInstrument: {
          // Sets the payment instrument information
          method: 'CREDIT_CARD', // Payment instrument method
          creditCard: {
            // Payment instrument information
            hash: order.paymentInstrument.hash, // Credit card hash
            holder: {
              // Credit card holder
              fullname: holder.fullname, // Card holder fulllname
              birthdate: holder.birthDate, // Card holder birthdate
              taxDocument: holder.taxDocument // Card holder document (CPF)
            }
          }
        }
      }
    } else {
      paymentInstrument = {
        // In case the payment instrument is a slip
        fundingInstrument: {
          // Sets funding instrument information
          method: 'BOLETO', // Payment instrument method
          boleto: {
            // Payment instrument information
            expirationDate: moment()
              .add(10, 'days')
              .toDate()
              .toISOString()
              .split('T')[0] // Slip expiration date
          }
        }
      }
    }
    let paymentInfo = (await moip.payment.create(order.gatewayInfo.id, paymentInstrument)).body // Payment creation
    if (env.client.IS_DEVELOPMENT)
      confirmation = await OrderRefsCtrl.simulatePaymentApproval(
        paymentInfo.id,
        paymentInfo.amount.total
      ) // Payment simulation for testing environments
    order = await Order.findOneAndUpdate({ _id: order._id }, { paymentInfo: paymentInfo }) // Payment saving
    return order // Returns order
  },
  simulatePaymentApproval: async (paymentId, amount) => {
    let config = { headers: MOIP_HEADERS } // Sets request headers
    let url = `${
      process.env.MOIP_BASE_URL
    }/simulador/authorize?payment_id=${paymentId}&amount=${amount}` // Sets request url with payment id and amount
    let approval = (await axios.get(url, config)).data // Calls API for payment simulation
    return approval // Returns in case of success
  },
  getPayment: async function(id) {
    let order = await Order.findOne({ _id: id }).lean()
    if (!order || !order.paymentInfo || !order.paymentInfo.id) return {}
    let paymentId = order.paymentInfo.id // Sets payment id
    let config = { headers: MOIP_HEADERS } // Sets request headers
    let url = `${process.env.MOIP_BASE_URL}/v2/payments/${paymentId}` // Sets request url
    let payment = (await axios.get(url, config)).data
    return payment // Returns order
  }
})
