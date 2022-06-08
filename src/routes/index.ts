import { exampleRoute } from './example'
import express from 'express'

const router = express.Router()

/**
 * Create a Router type handler for each path, and set it in router.use
 */
router.use(exampleRoute())

export default router
