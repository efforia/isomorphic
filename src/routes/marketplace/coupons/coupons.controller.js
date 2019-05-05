/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Coupon controller.
 */

// --------------- Module Imports
import CouponPkg from 'coupon'

import Coupon from './coupon.model'

// --------------- Module Controller
const CouponsCtrl = {
  save: async function(coupon) {
    let couponInfo = CouponPkg(coupon.name)
      .give(coupon.discount)
      .limit(coupon.maxRedemptions)
      .expire(new Date(coupon.expirationDate)) // Creates the coupon
    return coupon._id
      ? await Coupon.findOneAndUpdate({ _id: coupon._id }, couponInfo, { new: true })
      : await Coupon.create(couponInfo)
  },
  list: async function() {
    let coupons = await Coupon.findWithDeleted({}) // Retrieves all the coupons
    return coupons // Returns coupons
  },
  get: async function(name) {
    return await Coupon.findOne({ name: name }) // Returns the coupon info
  },
  use: async function(name) {
    return await Coupon.findOneAndUpdate({ name: name }, { $inc: { countMax: -1 } }) // Reduces the couopon quantity
  },
  toggle: async function(couponId) {
    let coupon = await Coupon.findOneWithDeleted({ _id: couponId })
    let toggled = coupon.deleted ? await coupon.restore() : await coupon.delete() // Deactivates coupon
    return toggled // Returns coupon
  }
}
export default CouponsCtrl
