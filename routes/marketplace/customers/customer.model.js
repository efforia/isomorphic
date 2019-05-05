/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)
const User = require('../../users/user.model.js')

// --------------- Module Schema
let CustomerSchema = new mongoose.Schema({
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  paymentData: { type: Object },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet', default: [] }],
  facebook: { type: Object },
  favoriteMerchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', default: [] }]
})

// --------------- Module Plugins
CustomerSchema.plugin(lifecycle)
CustomerSchema.plugin(timestamps)
CustomerSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
let Customer = User.discriminator('Customer', CustomerSchema)

module.exports = Customer
