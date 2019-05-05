/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Chat controller.
 */

// --------------- Module Imports
// require('./chat.socket')
const Message = require('./message.model')

// --------------- Module Controller
const ChatsCtrl = (module.exports = {
  getUserChats: async function(user) {
    let chats = await Message.aggregate([
      // Group messages in chats
      { $match: { $or: [{ to: user }, { from: user }] } }, // Either sent from or to the user
      { $group: { _id: { from: '$from', to: '$to' } } } // Groups by the users ids
    ])
    return chats
  },
  getChatMessages: async function(user, chat) {
    let byCriteria = {
      $and: [{ $or: [{ to: user }, { from: user }] }, { $or: [{ to: chat }, { from: chat }] }]
    } // Sets query criteria
    let messages = await Message.find(byCriteria) // Finds messages
    return messages || [] // Returns messages or empty array
  }
})
