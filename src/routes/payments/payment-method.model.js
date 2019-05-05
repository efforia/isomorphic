/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Payment mode model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let PaymentMethodSchema = mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
})

// --------------- Module Plugins
PaymentMethodSchema.plugin(lifecycle)
PaymentMethodSchema.plugin(timestamps)
PaymentMethodSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema)
module.exports = PaymentMethod
