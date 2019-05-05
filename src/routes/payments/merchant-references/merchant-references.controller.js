/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description  controller.
 */

// --------------- Module Imports
import User from '../../users/user.model'

import axios from 'axios'
import gerarCpf from 'gerar-cpf'
import mongoose from 'mongoose'
import PhoneNumber from 'awesome-phonenumber'
import countries from 'i18n-iso-countries'

// --------------- Module Variables
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}
const DEFAULT_BIRTHDATE = '1990-10-10'

// --------------- Module Controller
const MerchantRefCtrl = {
  create: async function(user) {
    user = MerchantRefCtrl.formatAccountForGateway(user) // Fomats the database user as the payment gateway requires
    let url = `${process.env.MOIP_BASE_URL}/v2/accounts` // Sets the URL for the request
    let data = {
      // Sets request payload
      email: { address: user.email }, // User e-mail
      person: {
        // User information
        name: user.name.split(' ')[0], // User first name
        lastName: user.name.split(' ')[1] || user.name.split(' ')[0], // User last name
        taxDocument: { type: 'CPF', number: gerarCpf() }, // User tax document
        birthDate: DEFAULT_BIRTHDATE, // Since establishments don't have birth dates, returns the default one
        phone: user.formattedPhone, // User phone
        address: user.address // User address
      },
      type: 'MERCHANT', // User type
      transparentAccount: true // User account type (transparent accounts do not have to authenticate on the gateway)
    }
    let config = { headers: MOIP_HEADERS } // Sets the request config
    let merchant = (await axios.post(url, data, config)).data // Creates the merchant account on the gateway
    await User.findOneAndUpdate({ _id: user._id }, { 'payment.merchant': merchant }) // Adds the account to the user on our database
    return merchant // Returns the created account
  },
  formatAccountForGateway: merchant => {
    let phone = new PhoneNumber(merchant.phone, 'BR').getNumber('significant') // Formats user phone
    merchant.taxDocument = {
      // Formats user document
      type: merchant.documents[0].type, // Document type (CPF or CNPJ)
      number: merchant.documents[0].number // Document number
    }
    merchant.taxDocument.number = merchant.taxDocument.number.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/g,
      '$1.$2.$3-$4'
    ) // Formats the document number
    merchant.reference = new mongoose.Types.ObjectId() // Sets an unique id to the account
    if (merchant.address && merchant.address.country && merchant.address.country.length < 3)
      merchant.address.country = countries.toAlpha3(merchant.address.country) // Formats the user country
    merchant.address = {
      // Formats the user address
      street: merchant.address.street ? merchant.address.street.split(',')[0] : '', // User street name
      streetNumber: merchant.address.number, // User street number
      district: merchant.address.neighbourhood, // User neighbourhood
      city: merchant.address.city, // User city
      state: merchant.address.state, // User state
      country: merchant.address.country, // User country
      zipCode: merchant.address.postalCode
        ? merchant.address.postalCode.replace(/^([\d]{5})-*([\d]{3})/, '$1-$2')
        : undefined // User postal code
    }
    merchant.formattedPhone = {
      // Formats the user phone
      countryCode: '55', // Phone country code
      areaCode: phone ? phone.substring(0, 2) : undefined, // Phone area code
      number: phone ? phone.substring(2, phone.length) : undefined // Phone number
    }
    return merchant // Returns the formatted account information
  }
}
export default MerchantRefCtrl
