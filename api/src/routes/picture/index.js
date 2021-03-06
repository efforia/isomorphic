/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Picture routes.
 */

// --------------- Module Imports
import express from 'express'
import formidable from 'express-formidable'
import controller from './picture.controller'
import auth from '../../services/auth.service'


const router = express.Router('pictures')

router.post('/', auth.isAuthenticated(), formidable(), async (req, res, error) => {
  try {
    const {mimeType} = req.body
    const {sent} = req.body
    const ownerId = req.user._id // Gets the picture owner id
    const {file} = req.files
    const filename = file.name // Gets the upload file name
    const filepath = file.path // Gets the uploaded file path
    const picture = await controller.save(filename, filepath, ownerId, mimeType, sent)
    return res.status(200).json(picture)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', async (req, res, error) => {
  try {
    const {id} = req.params
    const picture = await controller.get(id)
    if (!picture) return res.status(404).send({}) // In case the picture is not found, returns a 404
    res.header('Content-Type', picture.mimeType) // Sets the response header
    return res.status(301).redirect(picture.externalRef) // And redirects to the file url
  } catch (e) {
    error(e)
  }
})

router.post('/remove/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {id} = req.params
    const removed = await controller.remove(id)
    return res.status(200).json(removed)
  } catch (e) {
    error(e)
  }
})

export default router
