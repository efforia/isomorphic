/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Lead model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const LeadSchema = mongoose.Schema({
  email: { type: String, lowercase: true, required: true }
})

// --------------- Module Plugins
LeadSchema.plugin(lifecycle)
LeadSchema.plugin(timestamps)
LeadSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Lead = mongoose.model('Lead', LeadSchema)
module.exports = Lead
