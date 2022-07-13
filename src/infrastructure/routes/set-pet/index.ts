import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
import { PetType } from '@src/infrastructure/database/models/pet'

export type SetPetsRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>
) => Router

export const setPetsHandler = async (
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const petData: PetType = get(req, 'body.petData', undefined)
  const email = get(req, 'body.decoded.email', undefined)

  if (!(petData && Object.keys(petData).length && email?.length))
    return res.sendStatus(400)

  const foundUser = await user.findOne(
    { email },
    {
      _id: true,
    }
  )

  if (!foundUser) return res.sendStatus(404)

  petData.accountId = foundUser._id

  try {
    const savedPet = await pet.create(petData)
    if (!savedPet) {
      console.error(
        `[PETS-MANAGER][PET_ERROR][CANT_CREATE] Pet could not be created: ${savedPet}`
      )
      return res.status(500).send(savedPet)
    }

    console.info('[PETS-MANAGER][PET_CREATED] Pet created')

    return res.status(201).send({})
  } catch (error: any) {
    return res.sendStatus(500)
  }
}

export const setPetsRoute: SetPetsRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>,
  pet: mongoose.Model<PetType>
): Router => {
  return router.post('/', (req, res) => setPetsHandler(user, pet, req, res))
}
