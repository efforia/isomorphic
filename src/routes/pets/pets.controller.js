const Pet = require('./pet.model')
const User = require('../users/user.model')
const Comment = require('../comments/comment.model')
/* const Socket = require('../utils/socket.utils')() */

const PetsCtrl = (module.exports = {
  addToUser: async function(user, pet) {
    pet.isNew = !(pet && pet._id) // Checks if is new pet
    if (!pet.isNew) {
      // In case the pet is actually new
      delete pet.createdAt // Removes timestamps in order to prevent conflicts
      delete pet.updatedAt // Removes timestamps in order to prevent conflicts
      delete pet.__v // Removes versioning in order to prevent conflicts
    }
    let saved = pet.isNew
      ? await Pet.create(pet)
      : await Pet.findOneAndUpdate({ _id: pet._id }, pet, { new: true }) // Creates pet with the given information
    return saved // Returns the updated pets list
  },
  removeFromUser: async function(user, pet) {
    if (pet.tutor == user._id) await Pet.remove({ _id: pet._id })
    return pet // Returns the updated pets list
  },
  getByUser: async function(user) {
    return await Pet.find({ tutor: user._id }) // Returns the user pets list
  },
  getByONG: async function(ong, status, page, pageSize) {
    let originalQuery = { ong: ong._id, status: status } // Sets the query parameters
    let paginatedQuery =
      page > 0
        ? Object.assign({}, originalQuery, { limit: pageSize, skip: page * pageSize })
        : originalQuery // Sets paginated query params
    let pets = (await Pet.find(paginatedQuery)) || [] // Searches for the ONG pets
    let count = ((await Pet.find(originalQuery)) || []).length // Gets count
    return { pets: pets, count: count } // Returns the pets list by status and geolocation
  },
  save: async function(ong, pet, status) {
    pet.ong = ong // Adds pet ong
    pet.status = status // Adds pet status
    delete pet.__v // Removes versioning in order to prevent conflicts
    delete pet.updatedAt // Removes timestamps in order to prevent conflicts
    delete pet.createdAt // Removes timestamps in order to prevent conflicts
    pet.address = ong.address // Adds pet address
    let saved = pet._id
      ? await Pet.findOneAndUpdate({ _id: pet._id }, pet, { new: true })
      : await Pet.create(pet) // Creates pet with the given information
    return saved
  },
  remove: async function(user, pet) {
    return (await User.findOneAndUpdate({ _id: user._id }, { $pull: { pets: pet } }).populate(
      'pets'
    )).pets // Removes pet and returns the updated pets list
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
    let pets = (await Pet.aggregate([{ $geoNear: paginatedQuery }])) || [] // Searches for the nearby pets
    let count = ((await Pet.aggregate([{ $geoNear: originalQuery }])) || []).length // Gets count
    return { pets: pets, count: count } // Returns the pets list by status and geolocation
  },
  get: async function(id) {
    let pet = await Pet.findOne({ _id: id })
      .populate('tutor ong')
      .lean() // Retrieves the pet information
    let comments = await Comment.find({ post: pet }).populate('user') // Retrieves the pet comments
    pet.comments = comments // Sets the comments on the pet object
    return pet // Returns pet information
  },
  update: async function(updates) {
    delete updates.__v // Removes document version in order to prevent conflicts
    return await Pet.findOneAndUpdate({ _id: updates._id }, updates) // Returns the pet information
  },
  addComment: async function(user, pet, comment) {
    comment.user = user // Sets user on comment
    comment.post = pet // Sets pet on the comment
    let createdComment = await Comment.create(comment) // Creates comment document
    let updated = await Pet.findOneAndUpdate(
      { _id: pet },
      { $push: { comments: createdComment._id } }
    ).lean() // Adds comment to the pet
    // Socket.emit('pet comment added', { room: pet, comment: comment })
    let comments = await Comment.find({ post: pet }).populate('user')
    return comments // Returns updated pet
  },
  removeComment: async function(user, pet, comment) {
    let removed = await Comment.remove({ _id: comment._id }) // Deletes comment
    let updated = await Pet.findOneAndUpdate(
      { _id: pet },
      { $pull: { comments: removed._id } }
    ).lean() // Removes comment from the pet
    // Socket.emit('pet comment removed', { room: pet, comment: comment })
    let comments = await Comment.find({ post: pet }).populate('user')
    return comments // Returns updated pet
  }
})
