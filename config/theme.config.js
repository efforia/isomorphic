/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Theme configuration.
 */

const Color = require('color')

const Theme = (module.exports = {
  PRIMARY_COLOR: '#ff145a',
  get DARKER_PRIMARY_COLOR() {
    return Color(Theme.PRIMARY_COLOR)
      .darken(0.1)
      .hex()
  },
  SECONDARY_COLOR: '#ff0044',
  get DARKER_SECONDARY_COLOR() {
    return Color(Theme.SECONDARY_COLOR)
      .darken(0.1)
      .hex()
  },
  TERCIARY_COLOR: '#1e88e5',
  get DARKER_TERCIARY_COLOR() {
    return Color(Theme.TERCIARY_COLOR)
      .darken(0.1)
      .hex()
  }
})
