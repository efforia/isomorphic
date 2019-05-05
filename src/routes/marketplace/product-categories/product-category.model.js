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
const ProductCategorySchema = mongoose.Schema({
  description: { type: String, required: true },
  slug: { type: String, lowercase: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' }],
  isRoot: { type: Boolean, default: false },
  externalHref: { type: String }
})

// --------------- Module Plugins
ProductCategorySchema.plugin(deepPopulate)
ProductCategorySchema.plugin(lifecycle)
ProductCategorySchema.plugin(timestamps)
ProductCategorySchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema)
export default ProductCategory
