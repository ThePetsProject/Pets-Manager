import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
import { PetType } from '@src/infrastructure/database/models/pet'

export type GetPetsRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>
) => Router

export const getPetsHandler = async (
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const email = get(req, 'decoded.email', undefined)

  if (!(email || email.length)) return res.sendStatus(401)

  const foundUser = await user.findOne(
    { email },
    {
      _id: true,
    }
  )

  if (!foundUser) return res.sendStatus(404)

  const pets = await pet.find(
    {
      accountId: foundUser._id,
    },
    {
      _id: false,
      accountId: false,
      __v: false,
    }
  )

  return res.status(200).send(pets)
}

export const getPetsRoute: GetPetsRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>
): Router => {
  return router.get('/', (req, res) => getPetsHandler(user, pet, req, res))
}
