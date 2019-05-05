/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description E-mail controller.
 */

// --------------- Module Imports
const nodemailerSendgrid = require('nodemailer-sendgrid')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const locales = require('../../services/locales.service')
const theme = require('../../config/theme.config')

const defaultLocales = locales.i18n.locales[locales.i18n.defaultLocale]
const full_year = new Date().getFullYear() // Full year

// --------------- Module Controller
const EmailsCtrl = (module.exports = {
  send: async function(options) {
    let defaults = {
      // Default context variables
      header_background: `${process.env.SERVER_ADDRESS}/texture.jpg`, // E-mail background
      icon: `${process.env.SERVER_ADDRESS}/icon.png`, // Application icon
      locales: defaultLocales, // Application locales for internationalization
      env: process.env, // Environment variables
      year: full_year, // Full year label
      colors: theme
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
          layoutsDir: __dirname + '/templates/', //
          partialsDir: __dirname + '/templates/partials/' //
        },
        viewPath: __dirname + '/templates/', //
        extName: '.hbs' //
      })
    )
    return await transport.sendMail(options)
  }
})
