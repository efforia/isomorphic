/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification controller.
 */

// --------------- Module Imports
import request from 'request'
import Notification from './notification.model'

// --------------- Module Controller
const NotificationsCtrl = {
  sendNotification: async notification => this.send(notification), // Sends and return the notification
  getById: async id => Notification.findOne({ _id: id }, '', { sort: { createdAt: -1 } }), // Retrieves notification
  getByUser: async user => {
    const id = user._id // Gets session user
    const notifications = await Notification.find({ to: { $elemMatch: { $eq: id } } }, '', {
      sort: { createdAt: -1 }
    }).lean() // Gets user notifications list
    notifications.forEach(notification => {
      // For each notification
      notification.read = !(JSON.stringify(notification.readBy).indexOf(user) === -1) // Checks if the notification hasn't been readed yet
    })
    return notifications // Returns the notifications list
  },
  send: async options =>
    new Promise((resolve, reject) => {
      if (!options) return reject(new Error('You have sent empty options object')) // In case the options object is empty
      let tags // Onesignal tags initialization
      if (options.to && options.to.length) {
        tags = options.to.map(user => ({ key: 'marsUserId', relation: '=', value: user }))
      } // Sets destinatary id
      const data = {
        // Notification information
        app_id: process.env.ONESIGNAL_APP_ID, // Application id from Onesignal
        tags, // Notification tags
        data: options.data,
        headings: { en: options.title }, // Notification title
        contents: { en: options.contents }, // Notification message
        big_picture: options.picture, // Notification picture
        android_group: 'ABC123', // Android notification group
        android_accent_color: process.env.PROJECT_PRIMARY_COLOR, // Android notification color
        android_group_message: { en: '$[notif_count] novas notificações' } // Android notification group title
      }
      data.firefox_icon = options.icon || options.picture // Notification picture for all the platforms
      data.chrome_web_icon = options.icon || options.picture // Notification picture for all the platforms
      data.small_icon = options.icon || options.picture // Notification picture for all the platforms
      data.large_icon = options.icon || options.picture // Notification picture for all the platforms

      const req = {
        // Request data
        url: 'https://onesignal.com/api/v1/notifications', // Request URL
        headers: {
          // Request Headers
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data) // Request body
      }
      request.post(req, async (error, response) => {
        const errorOccurred = String(response.statusCode)[0] !== '2' // In case the response is not on the 200's range (Success).
        if (errorOccurred) return reject(response) // In case of error, return it
        const notification = await Notification.create(options) // Creates notification
        resolve(notification) // Returns created notification
      })
    })
}
export default NotificationsCtrl
