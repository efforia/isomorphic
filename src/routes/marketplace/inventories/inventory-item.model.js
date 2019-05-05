/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Inventory item model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import mongooseDelete from 'mongoose-delete'

// --------------- Module Schema
const InventoryItemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem', required: true },
  parentType: { type: String, default: 'Inventory' },
  stock: { type: Number, required: true },
  price: { type: Number, required: true }
})

// --------------- Module Plugins
InventoryItemSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const InventoryItem = mongoose.model('InventoryItem', InventoryItemSchema)
export default InventoryItem
