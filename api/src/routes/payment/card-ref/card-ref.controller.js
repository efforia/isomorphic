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
import PhoneNumber from 'awesome-phonenumber'
import { MoipCreditCard } from 'moip-sdk-js'
import CustomerRefCtrl from '../customer-ref/customer-ref.controller'
import PaymentCtrl from '../payment.controller'
import User from '../../user/user.model'

// --------------- Module Variables

// --------------- Module Controller
const CardRefsCtrl = {
  add: async (user, cardInfo) => {
    if (!user.payment || !user.payment.customer) {
      // In case the user does not have an customer account
      const customerAccount = await CustomerRefCtrl.create(user) // Creates the customer account
      user.payment = { instruments: [], customer: customerAccount } // Sets it in the session user
    }
    const phone = new PhoneNumber(cardInfo.holder.phone, 'BR').getNumber('significant') // Formats the phone number
    const birthDate = (cardInfo.holder.birthDate ? new Date(cardInfo.holder.birthDate) : new Date())
      .toISOString()
      .split('T')[0] // Formats the birthdate
    const sensitiveInfo = {
      // Payment instrument information
      expirationMonth: cardInfo.expirationMonth, // Expiration month
      expirationYear: cardInfo.expirationYear.substring(2, 5), // Expiration year
      number: cardInfo.number.numbersOnly(), // Card number (without special chars)
      cvc: cardInfo.cvv // Cars security code
    }
    const hash = await CardRefsCtrl.hash(sensitiveInfo) // Hashes the payment card
    const creditCard = Object.assign(
      { hash },
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
    const instrument = Object.assign(creditCard, {
      _id: new mongoose.Types.ObjectId(),
      hash,
      createdAt: new Date()
    }) // Saves the payment card on the DB
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { 'payment.instruments': instrument } },
      { new: true }
    ).lean() // Updates the updated
    const instruments = updated.payment ? updated.payment.instruments : [] // Retrieves the updated payment instruments list
    return instruments // Returns the list
  },
  remove: async (user, id) => {
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { 'payment.instruments': { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    ).lean() // Updates the user
    const instruments = updated.payment ? updated.payment.instruments : [] // Retrieves the updated payment instruments list
    return instruments // Returns the list
  },
  list: async user => {
    const parsed = await User.findOne({ _id: user._id }).lean() // Retrieves logged in user
    const instruments =
      parsed.payment && parsed.payment.instruments ? parsed.payment.instruments : [] // Retrieves payment instruments list
    return instruments // Returns the list
  },
  hash: async card => {
    const pub_key = await PaymentCtrl.getPublicKey() // Gets the cateway master account public key
    const hash = await MoipCreditCard.setEncrypter(JSEncrypt, 'node')
      .setPubKey(pub_key)
      .setCreditCard(card)
      .hash() // Hashes the card sensitive information
    return hash // Returns the card hash
  }
}
export default CardRefsCtrl
