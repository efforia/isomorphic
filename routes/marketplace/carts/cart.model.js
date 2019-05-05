/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let CartSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  total: { type: Number },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem', required: true, sparse: true }]
})

// --------------- Module Plugins
CartSchema.plugin(lifecycle)
CartSchema.plugin(timestamps)
CartSchema.plugin(deepPopulate)
CartSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Cart = mongoose.model('Cart', CartSchema)
module.exports = Cart