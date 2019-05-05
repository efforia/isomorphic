/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Schedule model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let JobSchema = mongoose.Schema({
  merchant: { type: String, required: true },
  customerId: { type: String, required: true },
  bookedTo: { type: Date, required: true },
  service: { type: String, required: true },
  time: { type: Number, required: true, default: 120 },
  endTime: { type: Date }
})

// --------------- Module Plugins
JobSchema.plugin(deepPopulate)
JobSchema.plugin(lifecycle)
JobSchema.plugin(timestamps)
JobSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Job = mongoose.model('Job', JobSchema)
module.exports = Job
