/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Admin controller.
 */

// --------------- Module Imports
const User = require('../users/user.model')
const locales = require('../../services/locales.service')
const EmailsCtrl = require('../emails/emails.controller')

// --------------- Module Controller
const AdminCtrl = (module.exports = {
  ERRORS: {
    ROLE_IS_REQUIRED: 'ERROR_ROLE_IS_REQUIRED'
  },
  listUsers: async function(admin, role, keyword, page, pageSize) {
    let byCriteria = { _id: { $ne: admin }, roles: role } // Sets query criteria
    if (keyword.length > 0) {
      // In case there is an keyword
      byCriteria.$or = [
        // Either
        { name: { $regex: new RegExp(keyword), $options: 'i' } }, // The keyword is within the user name
        { email: { $regex: new RegExp(keyword), $options: 'i' } } // The keyword is within the user e-mail
      ]
    }
    const users = await User.findWithDeleted(byCriteria, '-password', {
      // Finds users
      sort: { role: -1, name: 1 } // Sorted by name
    })
      .limit(pageSize)
      .skip(page * pageSize) // With pagination
    const count = await User.count(byCriteria) // And total items count
    return { users: users, count: count } // Returns the users list
  },

  deactivateUser: async function(id) {
    let user = await User.findOneWithDeleted({ _id: id }) // Finds the user
    await user.delete() // Deactivates the user
    return user // Returns the user
  },

  activateUser: async function(id) {
    let user = await User.findOneWithDeleted({ _id: id }) // Finds the user
    await user.restore() // Activates the user
    return user // Returns the user
  },

  changeUserRole: async function(id, role) {
    if (!role) throw new Error(AdminCtrl.ERRORS.ROLE_IS_REQUIRED) // In case there is no role, 400!
    let user = await User.findOneAndUpdate(
      { _id: id },
      { role: role.toUpperCase(), __t: role.toTitleCase() }
    ) // Updates the user
    let message = {
      // Creates an e-mail message with
      from: `${process.env.PROJECT_DISPLAY_NAME} '<no-reply@${process.env.PROJECT_WEBSITE}>'`, // Sender
      subject: `${process.env.PROJECT_DISPLAY_NAME} : Atualização na conta`, // Subject
      template: 'account-role-update', // E-mail template
      to: user.email, // Receiver
      context: {
        // Variables for template processing
        role: locales.get(role.toLowerCase()), // New role
        applicationHref: `${process.env.SERVER_ADDRESS}/app/login/access` // Redirects to the login view
      }
    }
    await EmailsCtrl.send(message) // Awaits for e-mail confirmation
    return user // Returns the updated user
  }
})
