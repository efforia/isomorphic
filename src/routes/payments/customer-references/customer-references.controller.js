/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer controller.
 */

// --------------- Module Imports
import User from '../../users/user.model'

import gerarCpf from 'gerar-cpf'
import PhoneNumber from 'awesome-phonenumber'
import countries from 'i18n-iso-countries'
import mongoose from 'mongoose'
import axios from 'axios'

// --------------- Module Variables
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}
const DEFAULT_BIRTHDATE = '1991-10-10'

// --------------- Module Controller
const CustomerRefsCtrl = {
  create: async (user) => {
    user = CustomerRefsCtrl.format(user) // Formats the user information
    let url = `${process.env.MOIP_BASE_URL}/v2/customers` // Sets payment gateway customer url
    let customer = (await axios.post(
      url,
      {
        // Creates the user on the payment gateway
        ownId: user.reference, // User database reference on our API
        fullname: user.fullname, // User fullname
        email: user.email, // User e-mail
        birthDate: user.birthDate, // User birthdate
        taxDocument: user.taxDocument, // User tax document
        phone: user.formattedFone, // User phone
        shippingAddress: user.shippingAddress, // User billing information
        transparentAccount: true // Lets the application manage the user account
      },
      { headers: MOIP_HEADERS }
    )).data
    await User.findOneAndUpdate({ _id: user._id }, { 'payment.customer': customer }) // Adds the account to the user on our database
    return customer // Returns the created account
  },
  get: async (id) => {
    let url = `${process.env.MOIP_BASE_URL}/v2/customers/${id}` // Sets payment gateway customer url
    let customer = (await axios.get(url, { headers: MOIP_HEADERS })).data // Calls gateway
    return customer // Returns the updated user
  },
  remove: async (user) => {
    let id = user.payment.customer.id // Get account id
    let url = `${process.env.MOIP_BASE_URL}/v2/accounts/${id}` // Sets payment gateway delete url
    let deleted = (await axios.delete(url, { headers: MOIP_HEADERS })).body // Calls gateway
    user = await User.findOneAndUpdate({ _id: user._id }, { $unset: { 'payment.customer': 1 } }) // Removes the account from our database
    return user // Returns the updated user
  },
  format: customer => {
    let phone = new PhoneNumber(customer.phone, 'BR').getNumber('significant') // Formats user phone
    customer.birthDate = customer.birthDate
      ? customer.birthDate.toISOString().split('T')[0]
      : DEFAULT_BIRTHDATE // Gets user birthdate
    customer.birthDate = customer.birthDate.replace(/\//g, '-') // Formats user birthdate
    customer.taxDocument = { type: 'CPF', number: gerarCpf() } // Gets user tax document
    customer.reference = new mongoose.Types.ObjectId() // Sets user unique identifier
    if (customer.address && customer.address.country && customer.address.country.length < 3)
      customer.address.country = countries.toAlpha3(customer.address.country) // Formats customer country
    customer.shippingAddress = {
      // Formatted user addresss
      street: customer.address.street ? customer.address.street.split(',')[0] : '', // User street name
      streetNumber: customer.address.number, // User street number
      complement: customer.address.complement, // User address complement
      district: customer.address.neighbourhood, // User address neighbourhood
      city: customer.address.city, // User address city
      state: customer.address.state, // User address state
      country: customer.address.country, // User address country
      zipCode: customer.address.postalCode ? customer.address.postalCode.numbersOnly() : undefined // User formatted postal code (numbers only)
    }
    customer.fullname = customer.name // User fullname
    customer.formattedFone = {
      // User formatted phone
      countryCode: '55', // Phone country code
      areaCode: phone ? phone.substring(0, 2) : undefined, // Phone area code
      number: phone ? phone.substring(2, phone.length) : undefined // Phone number
    }
    return customer // Returns formatted customer
  }
}
export default CustomerRefsCtrl
