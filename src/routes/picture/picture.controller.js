/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Picture controller.
 */

// --------------- Module Imports
import { Storage } from '@google-cloud/storage'
import Picture from './picture.model'

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
      const picture = await Picture.create({
        // Creates the picture
        ownerId, // With the owner document id
        mimeType, // And the picture mime type
        sent, // And the timestamp from when the picture was uploaded
        file: filename, // And the picture file name
        externalRef // And the picture bucket file url
      })
      return picture // Returns the created picture
    } catch (e) {
      console.log(e)
    }
  },

  get: async id => Picture.findOne({ _id: id }), // Gets the picture information
  getLatest: async ownerId => Picture.findOne({ ownerId }), // Get the latest picture for the given item
  remove: async id => {
    const picture = await Picture.findOne({ _id: id }).lean() // Gets picture information
    const file = await storage.bucket(bucket).file(picture.file) // Gets picture file
    await file.delete() // Deletes picture file
    await Picture.remove({ _id: picture._id }) // Removes picture from database
    return picture
  }
}
export default PicturesCtrl
