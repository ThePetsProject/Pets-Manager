import { loginRoute } from './login'
import { healthRoute } from './health'
import { Router } from 'express'
import { User } from '@database/models/user'

/**
 * Create a Router type handler for each path, and set it in router.use
 */

export const routesArray = (router: Router) => [
  loginRoute(router, User),
  healthRoute(router),
]
