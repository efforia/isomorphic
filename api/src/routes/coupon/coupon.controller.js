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
  save: async coupon => {
    const couponInfo = CouponPkg(coupon.name)
      .give(coupon.discount)
      .limit(coupon.maxRedemptions)
      .expire(new Date(coupon.expirationDate)) // Creates the coupon
    return coupon._id
      ? Coupon.findOneAndUpdate({ _id: coupon._id }, couponInfo, { new: true })
      : Coupon.create(couponInfo)
  },
  list: async () => {
    const coupons = await Coupon.findWithDeleted({}) // Retrieves all the coupons
    return coupons // Returns coupons
  },
  get: async name => Coupon.findOne({ name }), // Returns the coupon info
  use: async name => Coupon.findOneAndUpdate({ name }, { $inc: { countMax: -1 } }), // Reduces the couopon quantity
  toggle: async couponId => {
    const coupon = await Coupon.findOneWithDeleted({ _id: couponId })
    const toggled = coupon.deleted ? await coupon.restore() : await coupon.delete() // Deactivates coupon
    return toggled // Returns coupon
  }
}
export default CouponsCtrl
