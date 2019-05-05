/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import deepPopulateFactory from 'mongoose-deep-populate'
import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

const deepPopulate = deepPopulateFactory(mongoose)

// --------------- Module Schema
const CartSchema = new mongoose.Schema({
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
  total: { type: Number },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem', required: true, sparse: true }]
})

// --------------- Module Plugins
CartSchema.plugin(lifecycle)
CartSchema.plugin(timestamps)
CartSchema.plugin(deepPopulate)
CartSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Cart = mongoose.model('Cart', CartSchema)
export default Cart
