/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Picture controller.
 */

// --------------- Module Imports
import Picture from './picture.model'

import { Storage } from '@google-cloud/storage'

// --------------- Module Variables
const bucket = process.env.FIREBASE_CONFIG_STORAGE_BUCKET
const storage = new Storage({ projectId: process.env.FIREBASE_CONFIG_PROJECT_ID }) // In case of authentication errors, please check the keys inside the env gcloud.json file

// --------------- Module Controller
const PicturesCtrl = {
  save: async (filename, filepath, ownerId, mimeType, sent) => {
    try {
      await storage.bucket(bucket).upload(filepath, { destination: filename, resumable: false }) // Opens the storage bucket
      const bucketFile = await storage.bucket(bucket).file(filename) // Creates a bucket file
      await bucketFile.makePublic() // Sets the file as public
      const externalRef = (await bucketFile.getMetadata())[0].mediaLink // Gets the reference to the file
      let picture = await Picture.create({
        // Creates the picture
        ownerId: ownerId, // With the owner document id
        mimeType: mimeType, // And the picture mime type
        sent: sent, // And the timestamp from when the picture was uploaded
        file: filename, // And the picture file name
        externalRef: externalRef // And the picture bucket file url
      })
      return picture // Returns the created picture
    } catch (e) {}
  },

  get: async (id) => {
    return Picture.findOne({ _id: id }) // Gets the picture information
  },

  getLatest: async (ownerId) => {
    return Picture.findOne({ ownerId: ownerId }) // Get the latest picture for the given item
  },

  remove: async (id) => {
    let picture = await Picture.findOne({ _id: id }).lean() // Gets picture information
    let file = await storage.bucket(bucket).file(picture.file) // Gets picture file
    await file.delete() // Deletes picture file
    await Picture.remove({ _id: picture._id }) // Removes picture from database
    return picture
  }
}
export default PicturesCtrl
