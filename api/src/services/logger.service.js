/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

export default {
  timePrefix: () => {
    const date = new Date()
    return `[${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(
      -2
    )}:${`0${date.getSeconds()}`.slice(-2)}]`
  },
  log: message => {
    const prefix = this.timePrefix()
    console.log(`${prefix}  ${message}`)
  }
}
