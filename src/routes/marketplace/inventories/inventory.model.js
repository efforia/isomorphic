/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import deepPopulateFactory from 'mongoose-deep-populate'
import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

const deepPopulate = deepPopulateFactory(mongoose)

jsonSchema(mongoose)

// --------------- Module Schema
const InventorySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true, unique: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true, unique: true }
  ]
})

// --------------- Module Plugins
InventorySchema.plugin(lifecycle)
InventorySchema.plugin(timestamps)
InventorySchema.plugin(deepPopulate)
InventorySchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Inventory = mongoose.model('Inventory', InventorySchema)
export default Inventory
