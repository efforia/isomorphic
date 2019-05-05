/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Picture routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('pictures')
const controller = require('./pictures.controller')
const auth = require('../../services/auth.service')

const formidable = require('express-formidable')

router.post('/', auth.isAuthenticated(), formidable(), async (req, res, error) => {
  try {
    let mimeType = req.body.mimeType
    let sent = req.body.sent
    let ownerId = req.user._id // Gets the picture owner id
    let file = req.files.file
    let filename = file.name // Gets the upload file name
    let filepath = file.path // Gets the uploaded file path
    let picture = await controller.save(filename, filepath, ownerId, mimeType, sent)
    return res.status(200).json(picture)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', async (req, res, error) => {
  try {
    let id = req.params.id
    let picture = await controller.get(id)
    if (!picture) return res.status(404).send({}) // In case the picture is not found, returns a 404
    res.header('Content-Type', picture.mimeType) // Sets the response header
    return res.status(301).redirect(picture.externalRef) // And redirects to the file url
  } catch (e) {
    error(e)
  }
})

router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let id = req.params.id
    let removed = await controller.remove(id)
    return res.status(200).json(removed)
  } catch (e) {
    error(e)
  }
})

module.exports = router
