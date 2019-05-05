/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Promotion item model.
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
const PromotionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromotionItem', required: true }],
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  editable: { type: Boolean, default: false },
  status: { type: String, default: 'inactive' }
})

// --------------- Module Functions and Hooks
const isActive = function(promotion) {
  const today = new Date()
  return new Date(promotion.startsAt) <= today && today <= new Date(promotion.endsAt)
}

const isEditable = function(promotion) {
  const today = new Date()
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
PromotionSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Promotion = mongoose.model('Promotion', PromotionSchema)
export default Promotion
