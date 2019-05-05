/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Promotion item model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const PromotionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromotionItem', required: true }],
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  editable: { type: Boolean, default: false },
  status: { type: String, default: 'inactive' }
})

// --------------- Module Functions and Hooks
let isActive = function(promotion) {
  let today = new Date()
  return new Date(promotion.startsAt) <= today && today <= new Date(promotion.endsAt)
}

let isEditable = function(promotion) {
  let today = new Date()
  return today <= new Date(promotion.endsAt)
}

PromotionSchema.post('findOne', promotion => {
  if (!promotion) return
  promotion.status = isActive(promotion) ? 'active' : 'inactive'
  promotion.editable = isEditable(promotion)
})

PromotionSchema.post('find', promotions => {
  if (promotions && promotions.map) {
    promotions.map(promotion => {
      if (!promotion) return
      promotion.status = isActive(promotion) ? 'active' : 'inactive'
      promotion.editable = isEditable(promotion)
    })
  }
})

// --------------- Module Plugins
PromotionSchema.plugin(deepPopulate)
PromotionSchema.plugin(lifecycle)
PromotionSchema.plugin(timestamps)
PromotionSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Promotion = mongoose.model('Promotion', PromotionSchema)
module.exports = Promotion
