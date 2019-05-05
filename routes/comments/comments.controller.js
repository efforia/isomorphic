/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Comment controller.
 */

// --------------- Module Imports
var Comment = require('./comment.model')

// --------------- Module Controller
const CommentsCtrl = (module.exports = {
  save: async function(comment) {
    comment.isNew = !(comment && comment._id) // Checks if is new comment
    if (!comment.isNew) {
      // In case the comment is actually new
      delete comment.createdAt // Removes timestamps in order to prevent conflicts
      delete comment.updatedAt // Removes timestamps in order to prevent conflicts
      delete comment.__v // Removes versioning in order to prevent conflicts
    }
    let saved = comment.isNew
      ? await Comment.create(comment)
      : await Comment.findOneAndUpdate({ _id: comment._id }, comment, { new: true }) // Creates comment with the given information
    return saved // Returns the updated comments list
  }
})
