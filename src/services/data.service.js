/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

import PhoneNumber from 'awesome-phonenumber'

export default {
  formatPhoneNumber: phone => {
    if (!phone) return ''
    return new PhoneNumber(phone, 'BR').getNumber('significant') // Formats user phone
  }
}
