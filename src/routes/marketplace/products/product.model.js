/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item model.
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
const ProductSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  attributes: [
    {
      label: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductAttribute', required: true },
      value: { type: String, required: true }
    }
  ],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true }],
  fullCategoriesList: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true }
  ],
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: { type: String, default: 'pending' },
  parentType: { type: String, default: 'Catalogue' },
  infoRef: { type: String },
  pictureRef: { type: String }
})

// --------------- Module Hooks
ProductSchema.pre('save', next => {
  this.information = this._id // Adds a self reference to the object
  next()
})

// --------------- Module Plugins
ProductSchema.plugin(lifecycle)
ProductSchema.plugin(timestamps)
ProductSchema.plugin(deepPopulate)
ProductSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Product = mongoose.model('Product', ProductSchema)
export default Product
