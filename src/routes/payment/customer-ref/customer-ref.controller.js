/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer controller.
 */

// --------------- Module Imports

import gerarCpf from 'gerar-cpf'
import PhoneNumber from 'awesome-phonenumber'
import countries from 'i18n-iso-countries'
import mongoose from 'mongoose'
import axios from 'axios'
import User from '../../user/user.model'

// --------------- Module Variables
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}
const DEFAULT_BIRTHDATE = '1991-10-10'

// --------------- Module Controller
const CustomerRefsCtrl = {
  create: async user => {
    const formattedUser = CustomerRefsCtrl.format(user) // Formats the user information
    const url = `${process.env.MOIP_BASE_URL}/v2/customers` // Sets payment gateway customer url
    const customer = (await axios.post(
      url,
      {
        // Creates the user on the payment gateway
        ownId: formattedUser.reference, // User database reference on our API
        fullname: formattedUser.fullname, // User fullname
        email: formattedUser.email, // User e-mail
        birthDate: formattedUser.birthDate, // User birthdate
        taxDocument: formattedUser.taxDocument, // User tax document
        phone: formattedUser.formattedFone, // User phone
        shippingAddress: formattedUser.shippingAddress, // User billing information
        transparentAccount: true // Lets the application manage the user account
      },
      { headers: MOIP_HEADERS }
    )).data
    await User.findOneAndUpdate({ _id: user._id }, { 'payment.customer': customer }) // Adds the account to the user on our database
    return customer // Returns the created account
  },
  get: async id => {
    const url = `${process.env.MOIP_BASE_URL}/v2/customers/${id}` // Sets payment gateway customer url
    const customer = (await axios.get(url, { headers: MOIP_HEADERS })).data // Calls gateway
    return customer // Returns the updated user
  },
  remove: async user => {
    const { id } = user.payment.customer // Get account id
    const url = `${process.env.MOIP_BASE_URL}/v2/accounts/${id}` // Sets payment gateway delete url
    await axios.delete(url, { headers: MOIP_HEADERS }) // Calls gateway
    return User.findOneAndUpdate({ _id: user._id }, { $unset: { 'payment.customer': 1 } }) // Removes the account from our database
  },
  format: customer => {
    const phone = new PhoneNumber(customer.phone, 'BR').getNumber('significant') // Formats user phone
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
