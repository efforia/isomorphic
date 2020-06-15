/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'

import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const NotificationSchema = mongoose.Schema({
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: { type: String },
  contents: { type: String },
  pictureUrl: { type: String },
  data: { type: Object },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, default: 'created' }
})

// --------------- Module Plugins
NotificationSchema.plugin(lifecycle)
NotificationSchema.plugin(timestamps)
NotificationSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
