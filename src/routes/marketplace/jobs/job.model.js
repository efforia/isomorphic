/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Schedule model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import deepPopulateFactory from 'mongoose-deep-populate'
import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

const deepPopulate = deepPopulateFactory(mongoose)

jsonSchema(mongoose)

// --------------- Module Schema
const JobSchema = mongoose.Schema({
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
JobSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Job = mongoose.model('Job', JobSchema)
export default Job
