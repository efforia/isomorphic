/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Comment model.
 */

// --------------- Module Imports
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoose_delete = require('mongoose-delete')
const lifecycle = require('mongoose-lifecycle')
require('mongoose-schema-jsonschema')(mongoose)

// --------------- Module Schema
const CommentSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId },
  content: { type: String }
})

// --------------- Module Plugins and Indexes
CommentSchema.plugin(lifecycle)
CommentSchema.plugin(timestamps)
CommentSchema.plugin(mongoose_delete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
