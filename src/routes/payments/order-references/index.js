/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Merchant category routes.
 */

// --------------- Module Imports
import express from 'express'


const router = express.Router('order-references')
import controller from './order-references.controller'
import auth from '../../../services/auth.service'

export default router
