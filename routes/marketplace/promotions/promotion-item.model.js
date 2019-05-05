/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Promotion item model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

// --------------- Module Schema
let PromotionItemSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem', required: true },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true },
  inventoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  parentType: { type: String, default: 'Promotion' },
  discountPrice: { type: Number }
})

// --------------- Module Plugins and indexes
PromotionItemSchema.index({ promotion: 1, inventoryRef: 1 }, { unique: true })
PromotionItemSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const PromotionItem = mongoose.model('PromotionItem', PromotionItemSchema)
module.exports = PromotionItem
