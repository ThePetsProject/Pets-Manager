import mongoose from 'mongoose'

export type BreedType = mongoose.Model<any> & {
  breedId: string
  breedName: string
  specie: string
}

const { Schema } = mongoose

const breedData = {
  breedId: {
    type: String,
    required: true,
  },
  breedName: {
    type: String,
    required: true,
  },
  specie: {
    type: String,
    required: true,
  },
}

const breedSchema = new Schema(breedData)

export const Breed = mongoose.model<BreedType>(
  'Breed',
  breedSchema,
  'petsBreeds'
)
