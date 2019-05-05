/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let InventorySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true, unique: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true, unique: true }
  ]
})

// --------------- Module Plugins
InventorySchema.plugin(lifecycle)
InventorySchema.plugin(timestamps)
InventorySchema.plugin(deepPopulate)
InventorySchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Inventory = mongoose.model('Inventory', InventorySchema)
module.exports = Inventory
