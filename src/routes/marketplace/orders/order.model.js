/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Order model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
let OrderSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  availableMerchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  items: [
    {
      information: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem' },
      price: { type: Number },
      discountPrice: { type: Number },
      quantity: { type: Number },
      total: { type: Number }
    }
  ],
  status: { type: String, default: 'created' },
  payload: { type: Object },
  deliveryTax: { type: Number },
  subtotal: { type: Number },
  total: { type: Number },
  acceptedAt: { type: Date },
  rejectedAt: { type: Date },
  paymentMethod: { type: String, default: 'ON_DELIVERY' },
  paymentInstrument: { type: Object, default: { label: 'CASH' } },
  receivingMode: { type: String, default: 'CHECKOUT' },
  ratings: {
    customerRate: { type: Number, default: 0 },
    merchantRate: { type: Number, default: 0 }
  },
  isGatewayPayment: { type: Boolean },
  gatewayInfo: { type: Object },
  paymentInfo: { type: Object }
})

// --------------- Module Plugins
OrderSchema.plugin(lifecycle)
OrderSchema.plugin(timestamps)
OrderSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Order =  mongoose.model('Order', OrderSchema)
module.exports = Order