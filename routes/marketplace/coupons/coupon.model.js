/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Coupon model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let CouponSchema = mongoose.Schema({
  name: { type: String, required: true }, // nome do cupom
  user: { type: String }, // id do merchant se desconto específico para um prestador de serviço
  countMax: { type: Number, required: true }, // quantidade de cupons a serem utilizados
  expirationDate: { type: Date, required: true }, // data limite para utilização do cupon
  discount: { type: Number, required: true } // porcentagem a ser descontada
})

// --------------- Module Plugins
CouponSchema.plugin(lifecycle)
CouponSchema.plugin(timestamps)
CouponSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Coupon = mongoose.model('Coupon', CouponSchema)
module.exports = Coupon
