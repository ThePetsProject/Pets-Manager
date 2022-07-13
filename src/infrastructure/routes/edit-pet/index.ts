import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
import { PetType } from '@src/infrastructure/database/models/pet'

export type EditPetsRouteFnType = (
  router: Router,
  pet: mongoose.Model<PetType>
) => Router

export const editPetsHandler = async (
  pet: mongoose.Model<PetType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const petData: PetType = get(req, 'body.petData', undefined)
  const email = get(req, 'body.decoded.email', undefined)

  if (!(petData && Object.keys(petData).length && email?.length))
    return res.sendStatus(400)

  const { microchipId } = petData

  const updatedPet = await pet.updateOne(
    { microchipId },
    {
      ...petData,
    }
  )

  if (!updatedPet) return res.sendStatus(500)

  return res.status(200).send({})
}

export const editPetsRoute: EditPetsRouteFnType = (
  router: Router,
  pet: mongoose.Model<PetType>
): Router => {
  return router.patch('/', (req, res) => editPetsHandler(pet, req, res))
}
