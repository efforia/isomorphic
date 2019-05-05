/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Payment controller.
 */

// --------------- Module Imports
const PaymentMethod = require('./payment-method.model')
const SeoService = require('../../services/seo.service')
const axios = require('axios')

// --------------- Module Variables
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}

// --------------- Module Controller
const PaymentsCtrl = (module.exports = {
  init: async () => {
    try {
      PaymentsCtrl.MARKETPLACE_ID = await PaymentsCtrl.getMarketplaceId() // Gets the MARTPLACE_ID and adds it the module exports
    } catch (e) {
      // In case of error
      console.log('Error obtaining the marketplace id!') // Returns it
    }
  },
  getPaymentDetails: async paymentId => {
    let url = `${process.env.MOIP_BASE_URL}/v2/payments/${paymentId}` // Sets request url
    let config = { headers: MOIP_HEADERS } // Sets request config
    let payment = (await axios.get(url, config)).data // Requests payment information
    return payment // Returns the payment information
  },
  savePaymentMethod: async function(method) {
    delete method.createdAt // Removes timestamps in order to prevent conflicts
    delete method.updatedAt // Removes timestamps in order to prevent conflicts
    delete method.__v // Removes versioning in order to prevent conflicts
    method.value = SeoService.getSlugFrom(method.label)
      .toUpperCase()
      .replace(/-/g, '_') // Generates method code
    let saved = method._id
      ? await PaymentMethod.findOneAndUpdate({ _id: method._id }, method)
      : await PaymentMethod.create(method) // Creates or updates method
    return saved // Returns subscription method
  },
  togglePaymentMethod: async function(methodId) {
    let method = await PaymentMethod.findOneWithDeleted({ _id: methodId })
    let toggled = method.deleted ? await method.restore() : await method.delete() // Deactivates method
    return toggled // Returns methods
  },
  getPaymentMethods: async function(user) {
    return user.roles.indexOf('ADMIN') > -1
      ? await PaymentMethod.findWithDeleted({}).sort('label')
      : await PaymentMethod.find({}).sort('label') // Gets payment modes list
  },
  getPaymentAuthKeys: async function() {
    let url = `${process.env.MOIP_BASE_URL}/v2/keys` // Sets the request url
    let keys = (await axios.get(url, { headers: MOIP_HEADERS })).data // Retrieves the payent gateway keys
    return keys // Returns the keys
  },
  getPublicKey: async function() {
    let url = `${process.env.MOIP_BASE_URL}/v2/keys` // Sets the request url
    let response = (await axios.get(url, { headers: MOIP_HEADERS })).data // Retrieves the payent gateway keys
    return response.keys.encryption // Returns the public key
  },
  getMarketplaceId: async () => {
    try {
      let account = (await axios.get(process.env.MOIP_BASE_URL + '/v2/accounts', {
        headers: MOIP_HEADERS
      })).data // Gets the account informatoin for given oauth token
      return account.id // Returns the (marketplace) account id.
    } catch (e) {
      console.log(e)
    }
  }
})

PaymentsCtrl.init()
