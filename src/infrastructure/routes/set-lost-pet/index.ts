import { v4 as uuidv4 } from 'uuid'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
import { LostPetType } from '@src/infrastructure/database/models/lost-pet'

export type SetLostPetsRouteFnType = (
  router: Router,
  pet: mongoose.Model<LostPetType>
) => Router

export const setLostPetsHandler = async (
  lostPet: mongoose.Model<LostPetType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const petData: LostPetType = get(req, 'body.petData', undefined)

  const petId = uuidv4()

  const newLostPet = await lostPet.create({ ...petData, petId })

  if (!newLostPet) return res.status(500).send()

  return res.status(200).send()
}

export const setLostPetsRoute: SetLostPetsRouteFnType = (
  router: Router,
  lostPet: mongoose.Model<LostPetType>
): Router => {
  return router.post('/lost', (req, res) =>
    setLostPetsHandler(lostPet, req, res)
  )
}
