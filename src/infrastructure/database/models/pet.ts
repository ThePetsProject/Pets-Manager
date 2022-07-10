import mongoose from 'mongoose'

export type PetType = mongoose.Model<any> & {
  accountId: mongoose.Types.ObjectId
  microchipId: string
  name: string
  color: string
  age: number
  species: string
  breed: string
  size: string
  description: string
}

const { Schema } = mongoose

const petData = {
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  microchipId: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  color: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // images: {
  //   type: array'
  //   items: {
  //     type: String
  //   }
  // }
}

const petSchema = new Schema(petData)

export const Pet = mongoose.model<PetType>('Pet', petSchema, 'pets')
