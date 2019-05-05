/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Insurance service.
 */

import geolocation from './geolocation'

const keepRunningOnBackground = () => {
  /* if (window.cordova && window.cordova.plugins) {
    const { backgroundMode } = window.cordova.plugins
    if (backgroundMode) backgroundMode.enable()
  } */
}

const initialize = () => {
  if (window.cordova) {
    setInterval(async () => {
      console.log('Here I am, running in background...')
      const position = await geolocation.getFromGPS()
      console.log(position)
      const response = await geolocation.save({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
      console.log(response)
    }, 60000)
    keepRunningOnBackground()
  }
}

export default { initialize }
