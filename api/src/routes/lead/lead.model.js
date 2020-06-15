/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Lead model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const LeadSchema = mongoose.Schema({
  email: { type: String, lowercase: true, required: true }
})

// --------------- Module Plugins
LeadSchema.plugin(lifecycle)
LeadSchema.plugin(timestamps)
LeadSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Lead = mongoose.model('Lead', LeadSchema)
export default Lead
