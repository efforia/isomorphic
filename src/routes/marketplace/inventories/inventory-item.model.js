/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory item model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

// --------------- Module Schema
let InventoryItemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem', required: true },
  parentType: { type: String, default: 'Inventory' },
  stock: { type: Number, required: true },
  price: { type: Number, required: true }
})

// --------------- Module Plugins
InventoryItemSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const InventoryItem = mongoose.model('InventoryItem', InventoryItemSchema)
module.exports = InventoryItem
