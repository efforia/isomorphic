/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Device model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const DeviceSchema = mongoose.Schema({
  uid: { type: String },
  model: { type: String },
  type: { type: String }
})

// --------------- Module Plugins and Indexes
DeviceSchema.plugin(lifecycle)
DeviceSchema.plugin(timestamps)
DeviceSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Device = mongoose.model('Device', DeviceSchema)
module.exports = Device
