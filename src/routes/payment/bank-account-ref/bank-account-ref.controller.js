/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Bank account controller.
 */

// --------------- Module Imports
import axios from 'axios'
import MerchantRefCtrl from '../merchant-ref/merchant-ref.controller'

import User from '../../user/user.model'

// --------------- Module Variables
const moip = require('moip-sdk-node').default({
  accessToken: process.env.MOIP_APP_TOKEN,
  production: process.env.ENV_TYPE === 'prod'
})

const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `OAuth ${process.env.MOIP_APP_TOKEN}`
}

// --------------- Module Controller
const BankAccountRefsCtrl = {
  add: async (user, accountInfo) => {
    if (!user.payment || !user.payment.merchant) {
      // In case the user does not have a merchant account
      const merchantAccount = await MerchantRefCtrl.create(user) // Creates the merchant account
      user.payment = { bankAccounts: [], merchant: merchantAccount } // Sets it on the session user
    }
    accountInfo.holder.taxDocument.number = accountInfo.holder.taxDocument.number.toCPF() // Formats user CPF
    const { merchant } = user.payment // Gets user merchant account
    const headers = Object.assign(MOIP_HEADERS, { Authorization: `OAuth ${merchant.accessToken}` }) // Sets payment gateway request headers
    const url = `${process.env.MOIP_BASE_URL}/v2/accounts/${merchant.id}/bankaccounts` // Sets payment gateway request url
    const bankAccount = (await axios.post(url, accountInfo, { headers })).data // Calls payment gateway in order to save account
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { 'payment.bankAccounts': bankAccount } },
      { new: true }
    ).lean() // Adds account on DB
    return updated.payment.bankAccounts // Returns updated bank accounts list
  },
  remove: async (user, id) => {
    try {
      await moip.bankAccount.remove(id)
    } catch (e) {
      console.error(e)
    } // Removes it on the payment gateway
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { 'payment.bankAccounts': { id } } },
      { new: true }
    ).lean() // Deletes it from the DB
    const bankAccounts = updated.payment ? updated.payment.bankAccounts : [] // Gets updates bank accounts list
    return bankAccounts // Returns bank accounts list
  },
  list: async user => {
    const parsed = await User.findOne({ _id: user._id }).lean() // Gets logged in user
    const bankAccounts =
      parsed.payment && parsed.payment.bankAccounts ? parsed.payment.bankAccounts : [] // Gets bank accounts
    return bankAccounts // Returns bank accounts
  }
}
export default BankAccountRefsCtrl
