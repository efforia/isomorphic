/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let MarketItemAttributeSchema = mongoose.Schema({
  description: { type: String, required: true }
})

// --------------- Module Plugins
MarketItemAttributeSchema.plugin(lifecycle)
MarketItemAttributeSchema.plugin(timestamps)
MarketItemAttributeSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  validateBeforeDelete: false
})

// --------------- Module Model
const MarketItemAttribute = mongoose.model('MarketItemAttribute', MarketItemAttributeSchema)
module.exports = MarketItemAttribute
