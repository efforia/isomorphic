/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User controller.
 */

// --------------- Module Imports
import auth from '../../services/auth.service'

import EmailsCtrl from '../../services/emails/emails.controller'
import DataService from '../../services/data.service'
import User from './user.model'

// --------------- Module Variables

// --------------- Module Controller
const UsersCtrl = {
  ERRORS: {
    DUPLICATED_USER: 'DUPLICATED_USER'
  },
  create: async information => {
    const result = await User.findOne({ email: information.email }) // Tries to locate user
    if (result) throw new Error(UsersCtrl.ERRORS.DUPLICATED_USER) // In case it already exists, return error
    if (information.phone)
      information.formattedPhone = DataService.formatPhoneNumber(information.phone, 'BR') // Formats phone number
    const created = await User.create(information) // Creates user on the database
    const user = created.toObject() // Turns user object into editable object
    return Object.assign(user, { token: User.getTokenFor(user) }) // Returns the created user
  },
  sendWelcomeEmail: async user => {
    auth.generateEmailConfirmation(async confirmation => {
      const hash = `${confirmation}${user._id}` // Generates e-mail confirmation hash
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { emailConfirmation: { hash, createdAt: new Date() } }
      ) // Sets confirmation hash on the user object
      const project = process.env.PROJECT_DISPLAY_NAME // Gets the project name
      const message = {
        // Sets e-mail information
        from: `${project} '<no-reply@${process.env.PROJECT_WEBSITE}>'`, // From the e-mail sender account
        subject: `${project} : Confirmação de e-mail.`, // Regards e-mail confirmation
        template: 'email-confirmation', // Using the confirmation e-mail
        to: updatedUser.email, // To the created user
        context: {
          confirmationLink: `${process.env.SERVER_ADDRESS + process.env.PWA_ADDRESS}/login/${hash}`
        } // With the e-mail confirmation link
      }
      const sent = await EmailsCtrl.send(message) // Sends the e-mail
      return sent // Returns confirmation
    })
  },
  get: async user => {
    const parsed = await User.findOne({ _id: user._id }, '-password') // Retrieves the user
    return Object.assign(parsed.toObject(), { token: User.getTokenFor(parsed) }) // Sends it with an updated token
  },
  isUniqueUsername: async username => {
    const exists = await User.findOne({ username }).lean() // Checks if the username already exists on the database
    return !exists // Returns confirmation
  },
  update: async (user, updates) => {
    delete updates.role // Deletes role (prevents Mr. Robots to get in)
    delete updates.password // Deletes password (for the same reason)
    delete updates.createdAt // Removes timestamps in order to prevent conflicts
    delete updates.updatedAd // Removes timestamps in order to prevent conflicts
    if (updates.phone) updates.formattedPhone = DataService.formatPhoneNumber(updates.phone, 'BR') // Formats the phone number
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: updates },
      { new: true }
    ).lean() // Updates the user
    return Object.assign(updated, { token: User.getTokenFor(user) }) // Returns the updated user
  },
  authenticate: async email => {
    const user = await User.findOne({ email }, '-password') // Gets the user information (without password, of course)
    user.update({ $set: { active: true } }) // Sets it as active on the application database
    return Object.assign(user.toObject(), { token: User.getTokenFor(user) }) // Returns the user information
  },
  updatePassword: async (user, newPassword) =>
    User.findOneAndUpdate({ _id: user._id }, { $set: { password: newPassword } }), // Returns updated user
  recoverPassword: async email => {
    let user = await User.findOne({ email }) // Gets user information
    if (!user) throw new Error('Whoops! Check your credentials and try again!') // In case there is no user with this e-mail, return error
    auth.generatePassword(async randomPassword => {
      // Generates random temporary password
      user = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: user.hashPassword(randomPassword) } }
      ) // Sets it on the datase
      const project = process.env.PROJECT_DISPLAY_NAME // Gets project name
      const message = {
        // Sets e-mail information
        from: `${project} '<no-reply@${process.env.PROJECT_WEBSITE}>'`, // From the e-mail sender account
        subject: `${project} : Redefinição de Senha`, // With the password recovery subject
        template: 'password-recovery', // With the password recovery e-mail template (.hbs)
        to: user.email, // To the user e-mail
        context: { newPassword: randomPassword } // Containing the new password
      }
      const confirmation = await EmailsCtrl.send(message) // Sends the e-mail message
      return confirmation // Returns the confirmation
    })
  }
}
export default UsersCtrl
