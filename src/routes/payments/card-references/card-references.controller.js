/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Credit card controller.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import gerarCpf from 'gerar-cpf'
import JSEncrypt from 'node-jsencrypt'
import CustomerRefCtrl from '../customer-references/customer-references.controller'
import PaymentCtrl from '../../payments/payments.controller'
import PhoneNumber from 'awesome-phonenumber'
import User from '../../users/user.model'

// --------------- Module Variables
import { MoipCreditCard } from 'moip-sdk-js'

// --------------- Module Controller
const CardRefsCtrl = {
  add: async (user, cardInfo) => {
    if (!user.payment || !user.payment.customer) {
      // In case the user does not have an customer account
      let customerAccount = await CustomerRefCtrl.create(user) // Creates the customer account
      user.payment = { instruments: [], customer: customerAccount } // Sets it in the session user
    }
    let gatewayRef = user.payment.customer // Gets the customer reference from the payyment gateway
    let phone = new PhoneNumber(cardInfo.holder.phone, 'BR').getNumber('significant') // Formats the phone number
    let birthDate = (cardInfo.holder.birthDate ? new Date(cardInfo.holder.birthDate) : new Date())
      .toISOString()
      .split('T')[0] // Formats the birthdate
    let sensitiveInfo = {
      // Payment instrument information
      expirationMonth: cardInfo.expirationMonth, // Expiration month
      expirationYear: cardInfo.expirationYear.substring(2, 5), // Expiration year
      number: cardInfo.number.numbersOnly(), // Card number (without special chars)
      cvc: cardInfo.cvv // Cars security code
    }
    let hash = await CardRefsCtrl.hash(sensitiveInfo) // Hashes the payment card
    let creditCard = Object.assign(
      { hash: hash },
      {
        first4: sensitiveInfo.number.substring(0, 4),
        last4: sensitiveInfo.number.substring(
          sensitiveInfo.number.length - 5,
          sensitiveInfo.number.length - 1
        ),
        holder: {
          // Card holder information
          fullname: cardInfo.holder.name, // Card holder fullname
          birthdate: birthDate, // Card holder birthdate
          taxDocument: {
            // Card holder tax document
            type: 'CPF', // Card holder tax document type ("CPF"  or "CNPJ")
            number: gerarCpf() // Card holder tax document number (without special chars)
          },
          phone: {
            // Formatted phone
            countryCode: '55', // Phone country code
            areaCode: phone ? phone.substring(0, 2) : undefined, // Phone area code
            number: phone ? phone.substring(2, phone.length) : undefined // Phone number
          }
        }
      }
    )
    let instrument = Object.assign(creditCard, {
      _id: new mongoose.Types.ObjectId(),
      hash: hash,
      createdAt: new Date()
    }) // Saves the payment card on the DB
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { 'payment.instruments': instrument } },
      { new: true }
    ).lean() // Updates the user
    let instruments = user.payment ? user.payment.instruments : [] // Retrieves the updated payment instruments list
    return instruments // Returns the list
  },
  remove: async (user, id) => {
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { 'payment.instruments': { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    ).lean() // Updates the user
    let instruments = user.payment ? user.payment.instruments : [] // Retrieves the updated payment instruments list
    return instruments // Returns the list
  },
  list: async user => {
    user = await User.findOne({ _id: user._id }).lean() // Retrieves logged in user
    let instruments = user.payment && user.payment.instruments ? user.payment.instruments : [] // Retrieves payment instruments list
    return instruments // Returns the list
  },
  hash: async card => {
    let pub_key = await PaymentCtrl.getPublicKey() // Gets the cateway master account public key
    let hash = await MoipCreditCard.setEncrypter(JSEncrypt, 'node')
      .setPubKey(pub_key)
      .setCreditCard(card)
      .hash() // Hashes the card sensitive information
    return hash // Returns the card hash
  }
}
export default CardRefsCtrl
