/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User controller.
 */

import EventEmitter from 'events'
import { advertising } from 'ble-utils'

const BEACONS_UPDATE = 'BEACONS_UPDATE'
const onUpdateEventEmitter = new EventEmitter(BEACONS_UPDATE)

const emitUpdateEvent = device => {
  onUpdateEventEmitter.emit(BEACONS_UPDATE, device) // Adds the possibility to extend sync funcionalities
}

const onUpdate = listener => {
  onUpdateEventEmitter.addListener(BEACONS_UPDATE, listener)
}

const scan = (seconds, callback) => {
  const { ble } = window
  if (ble) {
    ble.startScan(
      [],
      device => {
        if (device && device.advertising) {
          const raw = device.advertising
          const parsed = advertising.parse(raw)
          device.advertising = parsed
          if (device.name && device.name.indexOf('AT Beacon') > -1) {
            device.name = 'Seu Device'
            callback(device)
          }
        }
      },
      e => {
        console.log(e)
      }
    )
  } else {
    callback({
      name: 'TI SensorTag',
      id: 'BD922605-1B07-4D55-8D09-B66653E51BBA',
      rssi: -79
    })
  }
}

const watch = () => {
  console.log('Starting to scan for beacons...')
  scan(15, device => {
    emitUpdateEvent(device)
  })
}

const connect = (deviceId, onConnect, onDisconnect) => {
  const { ble } = window
  if (ble) ble.connect(deviceId, onConnect, onDisconnect)
  else onConnect(deviceId)
}

const isNearby = deviceId => {
  const { ble } = window
  return new Promise(resolve => {
    const onConnected = () => {
      console.log(`${deviceId} is connected. `)
      resolve(true)
    }
    const onDisconnected = () => {
      console.log(`${deviceId} is disconnected. `)
      resolve(false)
    }
    ble.isConnected(deviceId, onConnected, onDisconnected)
  })
}

export default { scan, watch, onUpdate, connect, isNearby }
