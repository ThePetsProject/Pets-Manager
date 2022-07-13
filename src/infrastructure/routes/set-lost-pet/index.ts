import { v4 as uuidv4 } from 'uuid'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
import { LostPetType } from '@src/infrastructure/database/models/lost-pet'

export type SetLostPetRouteFnType = (
  router: Router,
  pet: mongoose.Model<LostPetType>
) => Router

export const setLostPetHandler = async (
  lostPet: mongoose.Model<LostPetType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const petData: LostPetType = get(req, 'body.petData', undefined)

  if (!(petData && Object.keys(petData).length)) return res.sendStatus(400)

  const petId = uuidv4()

  const newLostPet = await lostPet.create({ ...petData, petId })

  if (!newLostPet) return res.status(500).send()

  return res.status(201).send()
}

export const setLostPetRoute: SetLostPetRouteFnType = (
  router: Router,
  lostPet: mongoose.Model<LostPetType>
): Router => {
  return router.post('/lost', (req, res) =>
    setLostPetHandler(lostPet, req, res)
  )
}
