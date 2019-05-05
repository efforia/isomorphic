/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart item model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

// --------------- Module Schema
let CartItemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem' },
  inventoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  promotionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'PromotionItem' },
  parentType: { type: String, default: 'Cart' },
  quantity: { type: Number, required: true },
  isPromotional: { type: Boolean }
})

// --------------- Module Plugins
CartItemSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const CartItem = mongoose.model('CartItem', CartItemSchema)
module.exports = CartItem