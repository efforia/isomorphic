/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import jsonSchema from 'mongoose-schema-jsonschema'
import User from '../../users/user.model'

jsonSchema(mongoose)

// --------------- Module Schema
const MerchantSchema = new mongoose.Schema({
  merchantType: { type: String, enum: ['SERVICE_PROVIDER', 'MERCHANT'] },
  description: { type: String },
  website: { type: String },
  isPerson: { type: Boolean, default: false },
  isServiceProvider: { type: Boolean, default: false },
  acceptsGatewayPayments: { type: Boolean, default: false },
  operation: {
    closesForLunch: { type: Boolean, default: false },
    openingTime: { type: String },
    closingTime: { type: String },
    days: { type: Array, default: [] }
  },
  delivers: { type: Boolean, default: false },
  delivery: {
    minimumValue: { type: Number, default: 0.0 },
    time: { type: Number, default: 45 },
    tax: { type: Number, default: 0.0 },
    area: { type: String }
  },
  services: [
    {
      description: { type: String },
      prices: {
        PUPPY: { type: Number },
        P: { type: Number },
        M: { type: Number },
        G: { type: Number },
        GG: { type: Number }
      }
    }
  ],
  paymentData: {
    holder: { type: String },
    bankCode: { type: String },
    bankAgency: { type: String },
    bankAccount: { type: String }
  },
  paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
  rating: { type: Number, default: 0 },
  roles: [{ type: String, required: true, uppercase: true, default: 'MERCHANT' }]
})

// --------------- Module Plugins
MerchantSchema.plugin(lifecycle)
MerchantSchema.plugin(timestamps)
MerchantSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Merchant = User.discriminator('Merchant', MerchantSchema)
export default Merchant
