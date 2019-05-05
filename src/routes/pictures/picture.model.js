/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Picture model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'

jsonSchema(mongoose)

// --------------- Module Schema
const PictureSchema = mongoose.Schema({
  file: { type: String, lowercase: true, required: true },
  mimeType: { type: String, lowercase: true, default: 'image/jpeg' },
  externalRef: { type: String },
  sent: { type: String }
})

// --------------- Module Plugins
PictureSchema.plugin(lifecycle)
PictureSchema.plugin(timestamps)
PictureSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Picture = mongoose.model('Picture', PictureSchema)
export default Picture
