/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let MarketItemSchema = mongoose.Schema({
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
MarketItemSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const MarketItem = mongoose.model('MarketItem', MarketItemSchema)
module.exports = MarketItem
