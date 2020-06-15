/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription controller.
 */

// --------------- Module Imports
import axios from 'axios'
import MerchantRefCtrl from '../merchant-ref/merchant-ref.controller'

import User from '../../user/user.model'

// --------------- Module Variables

// --------------- Module Controller
const TransferRefsCtrl = {
  getAvailabeWithdrawal: async user => {
    try {
      let userInfo = user
      if (!user.payment || !user.payment.merchant) {
        // In case the user does not have a payment account as merchant
        const merchant = await MerchantRefCtrl.create(user) // Creates the payment gateway account
        userInfo = await User.findOneAndUpdate(
          { _id: user._id },
          { 'payment.merchant': merchant }
        ).lean() // Saves it on the database
      }
      const url = `${process.env.MOIP_BASE_URL}/v2/balances` // Sets the request url
      const token = userInfo.payment.merchant.accessToken // Gets the gateway transparent account token
      const headers = {
        Authorization: `Oauth ${token}`,
        'Content-Type': 'application/json;',
        Accept: 'application/json;version=2.1'
      } // Sets the request headers
      const response = (await axios.get(url, { headers })).data // Gets the merchant balance
      const current = response.current[0].amount / 100 // Gets the currently available balance
      const future = response.future[0].amount / 100 // Gets the future entries of the balance
      return { current, future } // Returns the balance information
    } catch (e) {
      console.log(e)
    }
  },
  transferWithdrawal: async (user, bankAccount, amount) => {
    let userInfo = user
    if (!user.payment || !user.payment.merchant) {
      // In case the user does not have a payment account as merchant
      const merchant = await MerchantRefCtrl.create(user) // Creates the payment gateway account
      userInfo = await User.findOneAndUpdate({ _id: user._id }, { 'payment.merchant': merchant }).lean() // Saves it on the database
    }
    const data = {
      // Request payload
      amount: amount * 100, // Transfer amount in cents
      transferInstrument: {
        // Transfer instrument
        method: 'BANK_ACCOUNT', // Transfer insturment method
        bankAccount // Transfer instrument info
      }
    }
    const url = `${process.env.MOIP_BASE_URL}/v2/transfers` // Sets the request url
    const token = userInfo.payment.merchant.accessToken // Gets the gateway transparent account token
    const headers = {
      Authorization: `Oauth ${token}`,
      'Content-Type': 'application/json;',
      Accept: 'application/json;version=2.1'
    } // Sets the request headers
    const response = (await axios.post(url, data, { headers })).data // Transfers the amount
    return response // Returns the operation status
  }
}
export default TransferRefsCtrl
