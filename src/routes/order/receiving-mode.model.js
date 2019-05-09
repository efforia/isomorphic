/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Order receiving mode model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const ReceivingModeSchema = mongoose.Schema({
  value: { type: String, required: true }
})

// --------------- Module Plugins
ReceivingModeSchema.plugin(lifecycle)
ReceivingModeSchema.plugin(timestamps)
ReceivingModeSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const ReceivingMode = mongoose.model('ReceivingMode', ReceivingModeSchema)
export default ReceivingMode
