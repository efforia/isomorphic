/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Admin model.
 */

// --------------- Module Imports
import mongoose from 'mongoose'

import timestamps from 'mongoose-timestamp'
import mongooseDelete from 'mongoose-delete'
import lifecycle from 'mongoose-lifecycle'
import User from '../user/user.model'

// --------------- Module Schema
const AdminSchema = new mongoose.Schema({})

// --------------- Module Plugins
AdminSchema.plugin(lifecycle)
AdminSchema.plugin(timestamps)
AdminSchema.plugin(mongooseDelete, { overrideMethods: 'all', validateBeforeDelete: false })

// --------------- Module Model
const Admin = User.discriminator('Admin', AdminSchema)

export default Admin
