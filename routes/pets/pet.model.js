/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Pet model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const PetSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  monthsAge: { type: Number },
  gramsWeight: { type: Number },
  temper: { type: String },
  size: { type: String },
  hairLength: { type: String },
  status: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ong: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }],
  address: {
    vicinity: { type: String, default: '' },
    street: { type: String, default: '' },
    number: { type: String },
    neighbourhood: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    complement: { type: String },
    location: { lng: Number, lat: Number },
    postalCode: { type: String }
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  available: { type: Boolean, default: false },
  found: { type: Boolean, default: false }
})

// --------------- Module Plugins and Indexes
PetSchema.index({ 'address.location': '2dsphere' })
PetSchema.plugin(lifecycle)
PetSchema.plugin(timestamps)
PetSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Pet = mongoose.model('Pet', PetSchema)
module.exports = Pet
