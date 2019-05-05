/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

const PhoneNumber = require('awesome-phonenumber')

module.exports = DataService = {
  formatPhoneNumber: phone => {
    if (!phone) return ''
    return new PhoneNumber(phone, 'BR').getNumber('significant') // Formats user phone
  }
}
