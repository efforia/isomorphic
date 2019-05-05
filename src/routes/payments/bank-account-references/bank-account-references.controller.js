/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Bank account controller.
 */

// --------------- Module Imports
import MerchantRefCtrl from '../merchant-references/merchant-references.controller'

import User from '../../users/user.model'
import axios from 'axios'

// --------------- Module Variables
const moip = require('moip-sdk-node').default({
  accessToken: process.env.MOIP_APP_TOKEN,
  production: process.env.ENV_TYPE == 'prod'
})
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}

// --------------- Module Controller
const BankAccountRefsCtrl = {
  add: async function(user, accountInfo) {
    if (!user.payment || !user.payment.merchant) {
      // In case the user does not have a merchant account
      let merchantAccount = await MerchantRefCtrl.create(user) // Creates the merchant account
      user.payment = { bankAccounts: [], merchant: merchantAccount } // Sets it on the session user
    }
    accountInfo.holder.taxDocument.number = accountInfo.holder.taxDocument.number.toCPF() // Formats user CPF
    let merchant = user.payment.merchant // Gets user merchant account
    let headers = Object.assign(MOIP_HEADERS, { Authorization: `OAuth ${merchant.accessToken}` }) // Sets payment gateway request headers
    let url = `${process.env.MOIP_BASE_URL}/v2/accounts/${merchant.id}/bankaccounts` // Sets payment gateway request url
    let bankAccount = (await axios.post(url, accountInfo, { headers: headers })).data // Calls payment gateway in order to save account
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { 'payment.bankAccounts': bankAccount } },
      { new: true }
    ).lean() // Adds account on DB
    return user.payment.bankAccounts // Returns updated bank accounts list
  },
  remove: async function(user, id) {
    try {
      await moip.bankAccount.remove(id)
    } catch (e) {
      console.error(e)
    } // Removes it on the payment gateway
    user = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { 'payment.bankAccounts': { id: id } } },
      { new: true }
    ).lean() // Deletes it from the DB
    let bankAccounts = user.payment ? user.payment.bankAccounts : [] // Gets updates bank accounts list
    return bankAccounts // Returns bank accounts list
  },
  list: async function(user) {
    user = await User.findOne({ _id: user._id }).lean() // Gets logged in user
    let bankAccounts = user.payment && user.payment.bankAccounts ? user.payment.bankAccounts : [] // Gets bank accounts
    return bankAccounts // Returns bank accounts
  }
}
export default BankAccountRefsCtrl
