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
const MarketItemSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  attributes: [
    {
      label: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItemAttribute', required: true },
      value: { type: String, required: true }
    }
  ],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MarketItemCategory', required: true }],
  fullCategoriesList: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItemCategory', required: true }
  ],
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem' },
  status: { type: String, default: 'pending' },
  parentType: { type: String, default: 'Catalogue' },
  infoRef: { type: String },
  pictureRef: { type: String }
})

// --------------- Module Hooks
MarketItemSchema.pre('save', next => {
  this.information = this._id // Adds a self reference to the object
  next()
})

// --------------- Module Plugins
MarketItemSchema.plugin(lifecycle)
MarketItemSchema.plugin(timestamps)
MarketItemSchema.plugin(deepPopulate)
MarketItemSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const MarketItem = mongoose.model('MarketItem', MarketItemSchema)
export default MarketItem
