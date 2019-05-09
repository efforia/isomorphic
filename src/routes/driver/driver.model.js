/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Driver model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'
import User from '../user/user.model'

jsonSchema(mongoose)

// --------------- Module Schema
const DriverSchema = new mongoose.Schema({
  rating: { type: Number, default: 0 },
  cpf: { type: String },
  paymentData: {
    holder: { type: String },
    bankCode: { type: String },
    bankAgency: { type: String },
    bankAccount: { type: String }
  },
  paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
  roles: [{ type: String, required: true, uppercase: true, default: 'MERCHANT' }]
})

// --------------- Module Plugins
DriverSchema.plugin(lifecycle)
DriverSchema.plugin(timestamps)
DriverSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Driver = User.discriminator('Driver', DriverSchema)
export default Driver
