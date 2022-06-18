import { loginRoute } from './login'
import { Router } from 'express'
import { User } from '@database/models/user'

const router = express.Router()

/**
 * Create a Router type handler for each path, and set it in router.use
 */
router.use(loginRoute(router, User))

export const routesArray = (router: Router) => [
  loginRoute(router, User),
]
