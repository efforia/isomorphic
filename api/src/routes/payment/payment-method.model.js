/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Payment mode model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'

import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const PaymentMethodSchema = mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
})

// --------------- Module Plugins
PaymentMethodSchema.plugin(lifecycle)
PaymentMethodSchema.plugin(timestamps)
PaymentMethodSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema)
export default PaymentMethod
