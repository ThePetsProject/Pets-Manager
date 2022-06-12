import { loginRoute } from './login'
import express from 'express'
import { User } from '@database/models/user'

const router = express.Router()

/**
 * Create a Router type handler for each path, and set it in router.use
 */
router.use(loginRoute(router, User))

export default router
