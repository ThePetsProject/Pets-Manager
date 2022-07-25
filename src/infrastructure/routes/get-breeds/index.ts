import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { BreedType } from '@src/infrastructure/database/models/breed'

export type GetBreedsRouteFnType = (
  router: Router,
  breed: mongoose.Model<BreedType>
) => Router

export const getBreedsHandler = async (
  breed: mongoose.Model<BreedType>,
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const breeds = await breed.aggregate([
      {
        $group: {
          _id: '$specie',
          breeds: {
            $push: {
              breedId: '$breedId',
              breedName: '$breedName',
            },
          },
        },
      },
    ])

    console.log(`[PETS-MANAGER][BREEDS] Got breeds`)

    return res.status(200).send(breeds)
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `[PETS-MANAGER][BREEDS][ERROR] Error getting breeds. ${error.message}`
      )
    } else {
      console.error(`[PETS-MANAGER][BREEDS][ERROR] Error getting breeds`, error)
    }
    return res.sendStatus(500)
  }
}

export const getBreedsRoute: GetBreedsRouteFnType = (
  router: Router,
  breed: mongoose.Model<BreedType>
): Router => {
  return router.get('/breeds', (req, res) => getBreedsHandler(breed, req, res))
}
