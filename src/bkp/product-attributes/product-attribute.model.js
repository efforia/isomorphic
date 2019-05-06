/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const ProductAttributeSchema = mongoose.Schema({
  description: { type: String, required: true }
})

// --------------- Module Plugins
ProductAttributeSchema.plugin(lifecycle)
ProductAttributeSchema.plugin(timestamps)
ProductAttributeSchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const ProductAttribute = mongoose.model('ProductAttribute', ProductAttributeSchema)
export default ProductAttribute
