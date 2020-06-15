/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import User from '../user/user.model'

require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const CustomerSchema = new mongoose.Schema({
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  paymentData: { type: Object },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet', default: [] }],
  facebook: { type: Object },
  favoriteMerchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', default: [] }]
})

// --------------- Module Plugins
CustomerSchema.plugin(lifecycle)
CustomerSchema.plugin(timestamps)
CustomerSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Customer = User.discriminator('Customer', CustomerSchema)

export default Customer
