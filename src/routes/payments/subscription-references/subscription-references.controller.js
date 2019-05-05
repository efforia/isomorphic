/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription controller.
 */

// --------------- Module Imports
import PhoneNumber from 'awesome-phonenumber'

import countries from 'i18n-iso-countries'
import mongoose from 'mongoose'
import moment from 'moment'
import axios from 'axios'
import User from '../../users/user.model'
import SeoService from '../../../services/seo.service'
import SubscriptionPlan from './subscription-plan.model'
import gerarCpf from 'gerar-cpf'

// --------------- Module Variables
const DEFAULT_SUBSCRIBER_BIRTHDATE = '10-10-1991'
const MOIP_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${process.env.MOIP_BASE64}`
}

// --------------- Module Controller
const SubscriptionRefsCtrl = {
  DEFAULT_SUBSCRIBER_BIRTHDATE: DEFAULT_SUBSCRIBER_BIRTHDATE,
  savePlan: async plan => {
    let url = `${process.env.MOIP_BASE_URL}/assinaturas/v1/plans` // Sets request URL
    let formattedPlan = Object.assign({}, plan) // Sets subscription plan formatted object
    if (plan.monthsTrial > 0) {
      // In case the plan offers a trial
      let today = moment() // Sets today date
      let trialEnd = moment().add(plan.monthsTrial, 'months') // Sets the trial ending date
      let trialDays = trialEnd.diff(today, 'days') // Gets the number of days between them
      formattedPlan.trial = {
        days: trialDays, // Sets the number of trial days
        enabled: true // Enables trial
      }
    }
    formattedPlan.amount = (plan.price * 100).toFixed(0) // Formats subscription price
    formattedPlan.code = formattedPlan.externalRef =
      plan.code || process.env.PROJECT_CODENAME + SeoService.getSlugFrom(plan.name) // Sets plan code
    formattedPlan.payment_method = 'ALL' // Allows both credit card and slip payments
    if (!plan.code) (await axios.post(url, formattedPlan, { headers: MOIP_HEADERS })).data
    // Stores the plan information on the gateway
    else (await axios.put(url + `/${plan.code}`, formattedPlan, { headers: MOIP_HEADERS })).data // Updates the plan information on the gateway
    plan = Object.assign(plan, formattedPlan) // Adds gateway information to the plan
    delete plan.createdAt // Removes timestamps in order to prevent conflicts
    delete plan.updatedAt // Removes timestamps in order to prevent conflicts
    delete plan.__v // Removes versioning in order to prevent conflicts
    let saved = plan._id
      ? await SubscriptionPlan.findOneAndUpdate({ _id: plan._id }, plan)
      : await SubscriptionPlan.create(plan) // Creates or updates plan
    return saved // Returns subscription plan
  },
  getPlans: async () => {
    let plans = await SubscriptionPlan.findWithDeleted({}) // Retrieves all the plans
    return plans // Returns plans
  },
  togglePlan: async planId => {
    let plan = await SubscriptionPlan.findOneWithDeleted({ _id: planId })
    let toggled = plan.deleted ? await plan.restore() : await plan.delete() // Deactivates plan
    return toggled // Returns plans
  },
  createSubscriber: async (user, subscriptionInfo) => {
    let customer = Object.assign({}, user) // Gets customer information
    customer.document = user.documents[0] // Sets document information
    customer.reference = user._id // Sets unique id reference to it
    customer.birthDate = user.birthDate || SubscriptionRefsCtrl.DEFAULT_SUBSCRIBER_BIRTHDATE // Sets the birthdate
    customer.instrument = subscriptionInfo.customer.billing_info // Sets the payment instrument
    let phone = customer.phone
      ? new PhoneNumber(customer.phone, 'BR').getNumber('significant')
      : customer.phone // Formats the phone number
    let birthDate = (customer.birthDate || '').replace(/\//g, '-') // Formats the birth date
    if (customer.address && customer.address.country && customer.address.country.length < 3)
      customer.address.country = countries.toAlpha3(customer.address.country) // Formats the customer country
    let data = {
      id: customer.reference, // Sets the unique id reference
      code: new mongoose.Types.ObjectId(), // Sets the subscriber code
      fullname: customer.name, // Sets the user fullname
      email: customer.email, // User e-mail
      phone_area_code: phone ? phone.substring(0, 2) : undefined, // Uerser phone area code
      phone_number: phone ? phone.substring(2, phone.length) : undefined, // User phone number
      birthdate_day: birthDate.substring(0, 2), // User birthdate day
      birthdate_month: birthDate.substring(3, 5), // User birthdate month
      birthdate_year: birthDate.substring(6, 10), // User birthdate year
      cpf: gerarCpf(), // User document
      address: {
        // Formatted address
        street: customer.address.street ? customer.address.street.split(',')[0] : '', // Street name
        number: customer.address.number, // Street number
        complement: customer.address.complement, // Address complement
        district: customer.address.neighbourhood, // Address neighbourhood
        city: customer.address.city, // Address city
        state: customer.address.state, // Address state
        country: customer.address.country, // Address country
        zipcode: customer.address.postalCode ? customer.address.postalCode.numbersOnly() : undefined // Address postal code (numbers only)
      }
    }
    const instrumentIsCreditCard = customer.instrument && customer.instrument.expirationMonth // Checks if the payment instrument is credit card
    data.billing_info = {} // Payment information
    if (instrumentIsCreditCard) {
      // In case it is
      let { expirationYear } = customer.instrument // Gets the payment card expiration year
      expirationYear = expirationYear.substring(2, 4) // Sets the 2 last digits only
      data.billing_info = {
        // Sets the payment instrument information
        credit_card: {
          // Credit card data
          holder_name: customer.instrument.holder.name, // Credit card holder name
          number: customer.instrument.number.replace(/ /g, ''), // Credit card number
          expiration_month: customer.instrument.expirationMonth, // Credit card expiration month
          expiration_year: expirationYear // Credit card expiration year
        }
      }
    }
    let createVault = instrumentIsCreditCard ? 'true' : 'false' // Create new card vault or not
    let url = `${process.env.MOIP_BASE_URL}/assinaturas/v1/customers?new_vault=${createVault}` // Sets request URL
    let confirmation = (await axios.post(url, data, { headers: MOIP_HEADERS })).data // Creates subscriber account
    await User.findOneAndUpdate({ _id: user._id }, { 'payment.subscriber': data }) // Saves it on the datase
    return data // Returns created subscriber
  },
  saveSubscription: async (customer, subscriptionInfo) => {
    try {
      customer, (payment = customer.payment || {}) // Prevents undefined var errors
      let subscriber =
        customer.payment.subscriber &&
        customer.payment.subscriber.billing_info &&
        !(
          Object.keys(customer.payment.subscriber.billing_info).length === 0 &&
          customer.payment.subscriber.billing_info.constructor === Object
        )
          ? customer.payment.subscriber
          : await SubscriptionRefsCtrl.createSubscriber(customer, subscriptionInfo) // Creates new subscriber
      let currentSubscription = customer.payment.subscription // Checks if is there any active subscription
      if (currentSubscription && currentSubscription.code)
        await SubscriptionRefsCtrl.cancelSubscription(currentSubscription.code) // Cancels current subscription first
      let data = {
        // Sets subscription data
        code: new mongoose.Types.ObjectId(), // Subscription code
        customer: { code: subscriber.code }, // Subscription custoer
        plan: { code: subscriptionInfo.plan.code }, // Subscription plan
        payment_method: subscriptionInfo.payment_method // Subscription payment method
      }
      let amount = subscriptionInfo.plan.amount
      if (subscriptionInfo.coupon && subscriptionInfo.coupon.discount)
        data.amount = amount - amount * subscriptionInfo.coupon.discount // Subscription coupon
      let url = `${process.env.MOIP_BASE_URL}/assinaturas/v1/subscriptions?new_customer=false` // Sets request URL
      let savedSubscription = (await axios.post(url, data, { headers: MOIP_HEADERS })).data // Creates subscription
      await User.findOneAndUpdate(
        { _id: customer._id },
        { 'payment.subscription': savedSubscription }
      ) // Saves it on the datase
      return savedSubscription // Returns created subscription
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  },
  getSubscription: async subscriptionCode => {
    let url = `${process.env.MOIP_BASE_URL}/assinaturas/v1/subscriptions/${subscriptionCode}` // Sets request URL
    let subscription = (await axios.get(url, { headers: MOIP_HEADERS })).data // Gets subscription information
    return subscription // Returns subscription information
  },
  isOutOfDate: async subscriptionCode => {
    return false
    let subscription = await SubscriptionRefsCtrl.getSubscription(subscriptionCode) // Gets subscription information
    let status = subscription.status.toUpperCase() // Gets subscription status
    let nextInvoice = subscription.next_invoice_date // Gets subscription next invoice date
    if (!nextInvoice) return false
    let nextInvoiceDate = new Date(nextInvoice.year, nextInvoice.month, nextInvoice.day) // Parses next invoice date
    let now = Date.now(),
      passedLastInvoice = now > nextInvoiceDate // Checks if the next invoice has already passed
    let isOutOfDate = passedLastInvoice && !(status == 'ACTIVE' || status == 'TRIAL') // Checks if the subscription is out of date
    return isOutOfDate // Returns out of date status
  },
  cancelSubscription: async subscriptionCode => {
    let url = `${
      process.env.MOIP_BASE_URL
    }/assinaturas/v1/subscriptions/${subscriptionCode}/suspend` // Sets cancelation URL
    let confirmation = (await axios.put(url, {}, { headers: MOIP_HEADERS })).data // Makes API call
    return confirmation // Retuns cancelation confirmation
  }
}
export default SubscriptionRefsCtrl
