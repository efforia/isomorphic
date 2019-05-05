/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription Plan model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'

import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const SubscriptionPlanSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, default: '' },
  price: { type: Number, required: true },
  monthsTrial: { type: Number, default: 0 },
  salePercentageFee: { type: Number, default: 0 },
  code: { type: String }
})

// --------------- Module Plugins and Indexes
SubscriptionPlanSchema.plugin(lifecycle)
SubscriptionPlanSchema.plugin(timestamps)
SubscriptionPlanSchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema)
export default SubscriptionPlan
