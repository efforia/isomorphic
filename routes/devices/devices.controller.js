const Device = require('./device.model')
const User = require('../users/user.model')
const Comment = require('../comments/comment.model')

const DevicesCtrl = (module.exports = {
  addToUser: async function(user, device) {
    device.isNew = !(device && device._id) // Checks if is new device
    if (!device.isNew) {
      // In case the device is actually new
      delete device.createdAt // Removes timestamps in order to prevent conflicts
      delete device.updatedAt // Removes timestamps in order to prevent conflicts
      delete device.__v // Removes versioning in order to prevent conflicts
    }
    let saved = device.isNew
      ? await Device.create(device)
      : await Device.findOneAndUpdate({ _id: device._id }, device, { new: true }) // Creates device with the given information
    return saved // Returns the updated devices list
  },
  removeFromUser: async function(user, device) {
    if (device.tutor == user._id) await Device.remove({ _id: device._id })
    return device // Returns the updated devices list
  },
  getByUser: async function(user) {
    return await Device.find({ tutor: user._id }) // Returns the user devices list
  },
  save: async function(ong, device, status) {
    device.ong = ong // Adds device ong
    device.status = status // Adds device status
    delete device.__v // Removes versioning in order to prevent conflicts
    delete device.updatedAt // Removes timestamps in order to prevent conflicts
    delete device.createdAt // Removes timestamps in order to prevent conflicts
    device.address = ong.address // Adds device address
    let saved = device._id
      ? await Device.findOneAndUpdate({ _id: device._id }, device, { new: true })
      : await Device.create(device) // Creates device with the given information
    return saved
  },
  remove: async function(user, device) {
    return (await User.findOneAndUpdate({ _id: user._id }, { $pull: { devices: device } }).populate(
      'devices'
    )).devices // Removes device and returns the updated devices list
  },
  getByStatus: async function(status, location, page, pageSize) {
    let byCriteria = { status: status } // Creates status filter
    let point = { coordinates: [location.longitude, location.latitude], type: 'Point' } // Formats the coordinates object
    let originalQuery = {
      near: point,
      query: byCriteria,
      distanceMultiplier: 0.001,
      spherical: true,
      lean: true,
      distanceField: 'distance'
    } // Sets the query parameters
    let paginatedQuery = Object.assign({}, originalQuery, {
      limit: pageSize,
      skip: page * pageSize
    }) // Sets paginated query params
    let devices = (await Device.aggregate([{ $geoNear: paginatedQuery }])) || [] // Searches for the nearby devices
    let count = ((await Device.aggregate([{ $geoNear: originalQuery }])) || []).length // Gets count
    return { devices: devices, count: count } // Returns the devices list by status and geolocation
  },
  get: async function(id) {
    let device = await Device.findOne({ _id: id })
      .populate('tutor ong')
      .lean() // Retrieves the device information
    let comments = await Comment.find({ post: device }).populate('user') // Retrieves the device comments
    device.comments = comments // Sets the comments on the device object
    return device // Returns device information
  },
  update: async function(updates) {
    delete updates.__v // Removes document version in order to prevent conflicts
    return await Device.findOneAndUpdate({ _id: updates._id }, updates) // Returns the device information
  },
  addComment: async function(user, device, comment) {
    comment.user = user // Sets user on comment
    comment.post = device // Sets device on the comment
    let createdComment = await Comment.create(comment) // Creates comment document
    let updated = await Device.findOneAndUpdate(
      { _id: device },
      { $push: { comments: createdComment._id } }
    ).lean() // Adds comment to the device
    let comments = await Comment.find({ post: device }).populate('user')
    return comments // Returns updated device
  },
  removeComment: async function(user, device, comment) {
    let removed = await Comment.remove({ _id: comment._id }) // Deletes comment
    let updated = await Device.findOneAndUpdate(
      { _id: device },
      { $pull: { comments: removed._id } }
    ).lean() // Removes comment from the device
    let comments = await Comment.find({ post: device }).populate('user')
    return comments // Returns updated device
  }
})
