/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Chat message model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')

// --------------- Module Schema
const ChatMessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  contents: { type: String, required: true },
  date: { type: Date, default: Date.now }
})

// --------------- Module Plugins
ChatMessageSchema.plugin(lifecycle)
ChatMessageSchema.plugin(timestamps)
ChatMessageSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema)
module.exports = ChatMessage
