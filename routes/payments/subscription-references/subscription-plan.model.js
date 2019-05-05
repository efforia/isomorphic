/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription Plan model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

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
SubscriptionPlanSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema)
module.exports = SubscriptionPlan
