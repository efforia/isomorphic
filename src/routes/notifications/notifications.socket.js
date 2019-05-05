/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification realtime.
 */

// --------------- Module Imports
/* import Notification from './notification.model'
const socket = require('../../config/socket').get()

// --------------- Module Events
socket.on('notifications received', async(notifications) => {
    if (notifications && notifications.forEach)
        notifications.forEach((notification) => {
            Notification.findOneAndUpdate({ _id: notification._id }, { status: 'received' })
        })
})

socket.on('notification read', async(data) => {
    if (data && data.notification && data.user) => {
        let notification = await Notification.findOneAndUpdate({ _id: data.notification }, { $addToSet: { readBy: data.user } }, { new: true })
        notification.to.forEach((user) => {
            socket.emit('notifications update', { room: user })
        })
    }
}) */
