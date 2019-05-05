/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item category model.
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
const MarketItemCategorySchema = mongoose.Schema({
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
MarketItemCategorySchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const MarketItemCategory = mongoose.model('MarketItemCategory', MarketItemCategorySchema)
export default MarketItemCategory
