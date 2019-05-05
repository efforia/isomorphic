/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Pet routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('pets')
const controller = require('./pets.controller')
const auth = require('../../services/auth.service')

/**
 * @interface getPet
 * Gets pet information based on the id.
 */
router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id
    let pet = await controller.get(id)
    return res.status(200).json(pet)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPetsByUser
 * Lists pets based on the user id.
 */
router.get('/by-user/list', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let pets = await controller.getByUser(user)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPetsByONG
 * Lists pets based on the provided status.
 */
router.get('/by-ong/:status', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let status = req.params.status
    let ong = req.user
    let page = parseInt(req.query.page || 1) // Parses the page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses the page size
    let pets = await controller.getByONG(ong, status, page, pageSize)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface getPetsByStatus
 * Lists pets based on the provided status.
 */
router.get('/by-status/:status', async (req, res, error) => {
  try {
    let status = req.params.status
    let location = {
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude)
    }
    let page = parseInt(req.query.page || 1) // Parses the page
    let pageSize = parseInt(req.query.pageSize || 5) // Parses the page size
    let pets = await controller.getByStatus(status, location, page, pageSize)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface savePet
 * Adds pet to the user list.
 */
router.post('/save/to-user', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.body
    let user = req.user
    let saved = await controller.addToUser(user, pet)
    return res.status(200).json(saved)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removePet
 * Adds pet to the user list.
 */
router.post('/remove/from-user/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.body
    let user = req.user
    let pets = await controller.removeFromUser(user, pet)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface savePet
 * Adds pet to the user list.
 */
router.post('/:status', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.body
    let user = req.user
    let status = req.params.status
    let pets = await controller.save(user, pet, status)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removePet
 * Removes pet from the user list.
 */
router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.params.id
    let user = req.user
    let pets = controller.remove(user, pet)
    return res.status(200).json(pets)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface addCommentToPet
 * Removes pet from the user list.
 */
router.post('/comments/add/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.params.id
    let user = req.user
    let comment = req.body
    let comments = await controller.addComment(user, pet, comment)
    return res.status(200).json(comments)
  } catch (e) {
    error(e)
  }
})

/**
 * @interface removeCommentFromPet
 * Removes pet from the user list.
 */
router.post('/comments/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let pet = req.params.id
    let user = req.user
    let comment = req.body
    let comments = await controller.removeComment(user, pet, comment)
    return res.status(200).json(comments)
  } catch (e) {
    error(e)
  }
})

module.exports = router
