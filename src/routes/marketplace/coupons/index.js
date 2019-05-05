/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Coupon routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './coupons.controller'
import auth from '../../../services/auth.service'


const router = express.Router('coupons')

/**
 * @interface getCoupons
 * Gets coupon from the database.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const coupon = await controller.list()
    return res.status(200).json(coupon)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface saveCoupon
 * Creates new coupon on the database.
 */
router.post('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const couponInfo = req.body
    const coupon = await controller.save(couponInfo)
    return res.status(200).json(coupon)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface toggleCoupon
 * Creates new coupon on the database.
 */
router.post('/:id/toggle', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const coupon = await controller.toggle(req.params.id)
    return res.status(200).json(coupon)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getCoupon
 * Gets coupon from the database.
 */
router.get('/:name', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {name} = req.params
    const coupon = await controller.get(name)
    return res.status(200).json(coupon)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface useCoupon
 * Use coupon from the database.
 */
router.post('/:name/use', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {name} = req.parameters
    const updated = await controller.use(name)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

export default router
