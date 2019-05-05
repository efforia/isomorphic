/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description E-mail controller.
 */

// --------------- Module Imports
import path from 'path'
import nodemailerSendgrid from 'nodemailer-sendgrid'

import hbs from 'nodemailer-express-handlebars'
import nodemailer from 'nodemailer'

const fullYear = new Date().getFullYear() // Full year

// --------------- Module Controller
const EmailsCtrl = {
  send: async options => {
    const defaults = {
      // Default context variables
      header_background: `${process.env.SERVER_ADDRESS}/texture.jpg`, // E-mail background
      icon: `${process.env.SERVER_ADDRESS}/icon.png`, // Application icon
      env: process.env, // Environment variables
      year: fullYear // Full year label
    }
    options.context = options.context ? Object.assign(defaults, options.context) : defaults // Context variables

    // let transport = nodemailer.createTransport({ service: 'Gmail', auth: { user: env.EMAIL_ADDRESS, pass: env.EMAIL_PASSWORD } })  //  Use this for Gmail )
    const transport = nodemailer.createTransport(
      nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
    ) //  Use this for SendGrid )

    // compile templates .hbs files => templates from: https://www.sendwithus.com/resources/templates/oxygen
    transport.use(
      'compile',
      hbs({
        // E-mail sender configuration
        viewEngine: {
          extname: '.hbs', // E-mail rendering engine
          layoutsDir: path.join(__dirname, '/templates/'),
          partialsDir: path.join(__dirname, '/templates/partials/') //
        },
        viewPath: path.join(__dirname, '/templates/'), //
        extName: '.hbs' //
      })
    )
    return transport.sendMail(options)
  }
}
export default EmailsCtrl
