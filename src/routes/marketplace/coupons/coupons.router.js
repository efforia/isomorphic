/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Coupon routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('coupons')
const controller = require('./coupons.controller')
const auth = require('../../../services/auth.service')

/**
 * @interface getCoupons
 * Gets coupon from the database.
 */
router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let coupon = await controller.list()
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
    let couponInfo = req.body
    let coupon = await controller.save(couponInfo)
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
    let coupon = await controller.toggle(req.params.id)
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
    let name = req.params.name
    let coupon = await controller.get(name)
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
    let name = req.parameters.name
    let updated = await controller.use(name)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

module.exports = router
