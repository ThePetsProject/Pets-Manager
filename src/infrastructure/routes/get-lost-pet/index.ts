import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get, set } from 'lodash'
import { LostPetType } from '@src/infrastructure/database/models/lost-pet'

export type GetLostPetsRouteFnType = (
  router: Router,
  pet: mongoose.Model<LostPetType>
) => Router

export const getLostPetsHandler = async (
  lostPet: mongoose.Model<LostPetType>,
  res: Response
): Promise<Response> => {
  const lostPets = await lostPet.find(
    {},
    {
      _id: false,
      __v: false,
    }
  )

  return res.status(200).send({ lostPets })
}

export const getLostPetsRoute: GetLostPetsRouteFnType = (
  router: Router,
  lostPet: mongoose.Model<LostPetType>
): Router => {
  return router.get('/lost', (req, res) => getLostPetsHandler(lostPet, res))
}
