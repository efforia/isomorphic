/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription controller.
 */

// --------------- Module Imports
import MerchantRefCtrl from '../merchant-references/merchant-references.controller'

import User from '../../users/user.model'
import axios from 'axios'

// --------------- Module Variables

// --------------- Module Controller
const TransferRefsCtrl = {
  getAvailabeWithdrawal: async user => {
    try {
      if (!user.payment || !user.payment.merchant) {
        // In case the user does not have a payment account as merchant
        let merchant = await MerchantRefCtrl.create(user) // Creates the payment gateway account
        user = await User.findOneAndUpdate(
          { _id: user._id },
          { 'payment.merchant': merchant }
        ).lean() // Saves it on the database
      }
      let url = `${process.env.MOIP_BASE_URL}/v2/balances` // Sets the request url
      let token = user.payment.merchant.accessToken // Gets the gateway transparent account token
      let headers = {
        Authorization: `Oauth ${token}`,
        'Content-Type': 'application/json;',
        Accept: 'application/json;version=2.1'
      } // Sets the request headers
      let response = (await axios.get(url, { headers: headers })).data // Gets the merchant balance
      let current = response.current[0].amount / 100 // Gets the currently available balance
      let future = response.future[0].amount / 100 // Gets the future entries of the balance
      return { current: current, future: future } // Returns the balance information
    } catch (e) {
      console.log(e)
    }
  },
  transferWithdrawal: async (user, bankAccount, amount) => {
    if (!user.payment || !user.payment.merchant) {
      // In case the user does not have a payment account as merchant
      let merchant = await MerchantRefCtrl.create(user) // Creates the payment gateway account
      user = await User.findOneAndUpdate({ _id: user._id }, { 'payment.merchant': merchant }).lean() // Saves it on the database
    }
    let data = {
      // Request payload
      amount: amount * 100, // Transfer amount in cents
      transferInstrument: {
        // Transfer instrument
        method: 'BANK_ACCOUNT', // Transfer insturment method
        bankAccount: bankAccount // Transfer instrument info
      }
    }
    let url = `${process.env.MOIP_BASE_URL}/v2/transfers` // Sets the request url
    let token = user.payment.merchant.accessToken // Gets the gateway transparent account token
    let headers = {
      Authorization: `Oauth ${token}`,
      'Content-Type': 'application/json;',
      Accept: 'application/json;version=2.1'
    } // Sets the request headers
    let response = (await axios.post(url, data, { headers: headers })).data // Transfers the amount
    return response // Returns the operation status
  }
}
export default TransferRefsCtrl
