/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

module.exports = logger = {
  log: message => {
    let prefix = logger.timePrefix()
    message = prefix + '  ' + message
    console.log(message)
  },
  timePrefix: () => {
    var date = new Date()
    return (
      '[' +
      ('0' + date.getHours()).slice(-2) +
      ':' +
      ('0' + date.getMinutes()).slice(-2) +
      ':' +
      ('0' + date.getSeconds()).slice(-2) +
      ']'
    )
  }
}
