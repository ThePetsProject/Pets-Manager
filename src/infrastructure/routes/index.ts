import { getPetsRoute } from './get-pets'
import { setPetsRoute } from './set-pet'
import { Router } from 'express'
import { User } from '@database/models/user'
import { Pet } from '@database/models/pet'
import { editPetsRoute } from './edit-pet'
import { Breed } from '../database/models/breed'
import { LostPet } from '../database/models/lost-pet'
import { getBreedsRoute } from './get-breeds'
import { setLostPetsRoute } from './set-lost-pet'
import { getLostPetsRoute } from './get-lost-pet'

/**
 * Create a Router type handler for each path, and set it in router.use
 */

export const routesArray = (router: Router) => [
  setPetsRoute(router, User, Pet),
  getPetsRoute(router, User, Pet),
  editPetsRoute(router, Pet),
]

export const routesArrayNosecure = (router: Router) => [
  getBreedsRoute(router, Breed),
  setLostPetsRoute(router, LostPet),
  getLostPetsRoute(router, LostPet),
]
