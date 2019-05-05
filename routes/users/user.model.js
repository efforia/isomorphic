/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const timestamps = require('mongoose-timestamp')
const jsonschema = require('mongoose-schema-jsonschema')(mongoose)
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

// --------------- Module Schema
const UserSchema = mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '', unique: true, lowercase: true, sparse: true },
  username: { type: String, unique: true, lowercase: true, sparse: true },
  verifiedEmail: { type: Boolean, default: false },
  emailConfirmation: {
    hash: { type: String },
    createdAt: { type: Date }
  },
  birthDate: { type: Date },
  oauth: { type: Object },
  provider: { type: String, default: 'native' },
  signupStep: { type: String, default: '' },
  password: { type: String },
  phone: { type: String },
  formattedPhone: { countryCode: String, areaCode: String, number: String },
  address: {
    vicinity: { type: String, default: '' },
    street: { type: String, default: '' },
    number: { type: String },
    neighbourhood: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'BR' },
    complement: { type: String },
    location: { lng: Number, lat: Number },
    postalCode: { type: String }
  },
  documents: [
    {
      type: { type: String, enum: ['CPF', 'CNPJ'], default: 'CPF' },
      number: { type: String, default: '' }
    }
  ],
  payment: {
    customer: { type: Object },
    merchant: { type: Object },
    subscriber: { type: Object },
    subscription: { type: Object },
    instruments: { type: Array, default: [] },
    bankAccounts: { type: Array, default: [] },
    hasDelayedPayments: { type: Boolean, default: false }
  },
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }],
  skip: {
    type: Object,
    default: {
      step: true
    }
  },
  role: [{ type: String, required: true, uppercase: true, default: 'CUSTOMER' }],
  roles: [{ type: String, required: true, uppercase: true, default: 'CUSTOMER' }]
})

// --------------- Module Plugins and Indexes
UserSchema.index({ 'address.location': '2dsphere' })
UserSchema.plugin(deepPopulate)
UserSchema.plugin(lifecycle)
UserSchema.plugin(timestamps)
UserSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Methods
UserSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

UserSchema.methods.passwordIsValid = function(password) {
  if (!password || !this.password) return false
  return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.getToken = function() {
  return jwt.sign({ _id: this._id }, process.env.MASTER_KEY)
}

// --------------- Module Hooks
/* Converts { latitude: ..., longitude: ... } into { longitude: ..., latitude: ... } */
function toLngLat(coordinates) {
  let formatted = {}
  let isLngLat = Object.keys(coordinates)[0] == 'lng'
  Object.keys(coordinates)
    .sort()
    .reverse()
    .map(key => (formatted[key] = coordinates[key]))
  return isLngLat ? coordinates : formatted
}

UserSchema.pre('findOneAndUpdate', function(next) {
  let updates = this.getUpdate().$set
  if (updates && updates.address && updates.address.location) {
    updates.address.location = toLngLat(updates.address.location)
  }
  next()
})

UserSchema.pre('save', function(next) {
  if (this.password) this.password = this.hashPassword(this.password)
  next()
})

// --------------- Module Model
const User = mongoose.model('User', UserSchema)
User.getTokenFor = function(user) {
  return jwt.sign({ _id: user._id }, process.env.MASTER_KEY)
}
module.exports = User

/* const emailsToRemove = ['ooooo@gmail.com']
User.find({}, (err, users) => {
  users.map(async user => {
    console.log(user.email)
    if (emailsToRemove.indexOf(user.email) > -1) {
      await User.findOneAndRemove({ _id: user._id })
      console.log('Removed ' + user.email + '.')
    }
  })
}) */
