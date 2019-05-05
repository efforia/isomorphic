/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item category model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let MarketItemCategorySchema = mongoose.Schema({
  description: { type: String, required: true },
  slug: { type: String, lowercase: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItemCategory' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MarketItemCategory' }],
  isRoot: { type: Boolean, default: false },
  externalHref: { type: String }
})

// --------------- Module Plugins
MarketItemCategorySchema.plugin(deepPopulate)
MarketItemCategorySchema.plugin(lifecycle)
MarketItemCategorySchema.plugin(timestamps)
MarketItemCategorySchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const MarketItemCategory = mongoose.model('MarketItemCategory', MarketItemCategorySchema)
module.exports = MarketItemCategory
