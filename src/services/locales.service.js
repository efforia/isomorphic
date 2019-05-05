/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Swagger configuration.
 */

const path = require('path')
const I18N = require('i18n-2')

const klawSync = require('klaw-sync')
const localesPath = path.resolve(__dirname, '..', 'locales')

const isWin = process.platform === 'win32'
const delimiter = isWin ? '\\' : '/'
const getLocaleName = filepath => {
  return filepath.substring(filepath.lastIndexOf(delimiter) + 1, filepath.lastIndexOf('.')) // Returns only the file name without extension
}

let localeFiles = {}
klawSync(localesPath) // Returns the folder files list
  .map(locale => {
    if (locale) return locale.path
  }) // Maps object to file path only
  .map(localePath => {
    return { id: getLocaleName(localePath), path: localePath }
  }) // Returns locales paths and ids
  .forEach(locale => {
    localeFiles[locale.id] = require(locale.path)
  }) // Formats locales object based on i18n specs

let i18n = new I18N({
  directory: path.resolve(__dirname, '../locales'),
  locales: localeFiles,
  defaultLocale: 'pt'
})
i18n.setLocale('pt')

module.exports = {
  i18n: i18n,
  get(label) {
    return i18n.__(label)
  }
}
