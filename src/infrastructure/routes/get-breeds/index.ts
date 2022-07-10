import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { get } from 'lodash'
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

  return res.status(200).send(breeds)
}

export const getBreedsRoute: GetBreedsRouteFnType = (
  router: Router,
  breed: mongoose.Model<BreedType>
): Router => {
  return router.get('/breeds', (req, res) => getBreedsHandler(breed, req, res))
}
