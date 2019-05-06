/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart item model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import mongooseDelete from 'mongoose-delete'

// --------------- Module Schema
const CartItemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  inventoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  promotionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'PromotionItem' },
  parentType: { type: String, default: 'Cart' },
  quantity: { type: Number, required: true },
  isPromotional: { type: Boolean }
})

// --------------- Module Plugins
CartItemSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const CartItem = mongoose.model('CartItem', CartItemSchema)
export default CartItem
