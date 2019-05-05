/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Database configuration.
 */

import mongoose from 'mongoose'
import bluebird from 'bluebird'

const connect = async () => {
  try {
    console.log(`☮ Connecting to MongoDB: ${process.env.MONGODB_URI}...`.yellow)
    mongoose.Promise = bluebird
    mongoose.set('useCreateIndex', true)
    await mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
    return mongoose.connection.db
  } catch (error) {
    console.log(`☮ MongoDB connection failure: ${error}!`.red)
  }
}

export default { connect }
