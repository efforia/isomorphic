/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification controller.
 */

// --------------- Module Imports
import Notification from './notification.model'

import request from 'request'

// --------------- Module Controller
const NotificationsCtrl = {
  sendNotification: async function(notification) {
    return await this.send(notification) // Sends and return the notification
  },
  getById: async function(id) {
    return await Notification.findOne({ _id: id }, '', { sort: { createdAt: -1 } }) // Retrieves notification
  },
  getByUser: async function(user) {
    user = user._id // Gets session user
    let notifications = await Notification.find({ to: { $elemMatch: { $eq: user } } }, '', {
      sort: { createdAt: -1 }
    }).lean() // Gets user notifications list
    notifications.map(notification => {
      // For each notification
      notification.read = !(JSON.stringify(notification.readBy).indexOf(user) == -1) // Checks if the notification hasn't been readed yet
    })
    return notifications // Returns the notifications list
  },
  send: async function(options) {
    return new Promise(function(resolve, reject) {
      if (!options) return reject({ message: 'You have sent empty options object' }) // In case the options object is empty
      let tags // Onesignal tags initialization
      if (options.to && options.to.length) {
        tags = options.to.map(user => {
          return { key: 'marsUserId', relation: '=', value: user }
        })
      } // Sets destinatary id
      let data = {
        // Notification information
        app_id: process.env.ONESIGNAL_APP_ID, // Application id from Onesignal
        tags: tags, // Notification tags
        data: options.data,
        headings: { en: options.title }, // Notification title
        contents: { en: options.contents }, // Notification message
        big_picture: options.picture, // Notification picture
        android_group: 'ABC123', // Android notification group
        android_accent_color: process.env.PROJECT_PRIMARY_COLOR, // Android notification color
        android_group_message: { en: '$[notif_count] novas notificações' } // Android notification group title
      }
      data.firefox_icon = data.chrome_web_icon = data.small_icon = data.large_icon =
        options.icon || options.picture // Notification picture for all the platforms
      let req = {
        // Request data
        url: 'https://onesignal.com/api/v1/notifications', // Request URL
        headers: {
          // Request Headers
          Authorization: 'Basic ' + process.env.ONESIGNAL_API_KEY,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data) // Request body
      }
      request.post(req, async (error, response, body) => {
        let errorOccurred = String(response.statusCode)[0] !== '2' // In case the response is not on the 200's range (Success).
        if (errorOccurred) return reject(response) // In case of error, return it
        let notification = await Notification.create(options) // Creates notification
        resolve(notification) // Returns created notification
      })
    })
  }
}
export default NotificationsCtrl
