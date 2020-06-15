/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Coupon model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'

import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const CouponSchema = mongoose.Schema({
  name: { type: String, required: true }, // nome do cupom
  user: { type: String }, // id do merchant se desconto específico para um prestador de serviço
  countMax: { type: Number, required: true }, // quantidade de cupons a serem utilizados
  expirationDate: { type: Date, required: true }, // data limite para utilização do cupon
  discount: { type: Number, required: true } // porcentagem a ser descontada
})

// --------------- Module Plugins
CouponSchema.plugin(lifecycle)
CouponSchema.plugin(timestamps)
CouponSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Coupon = mongoose.model('Coupon', CouponSchema)
export default Coupon
