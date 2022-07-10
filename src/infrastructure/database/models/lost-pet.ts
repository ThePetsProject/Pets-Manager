import mongoose from 'mongoose'

export type LostPetType = mongoose.Model<any> & {
  petId: string
  specie: string
  size: string
  status: string
  lng: number
  lat: number
}

const { Schema } = mongoose

const lostPetData = {
  petId: {
    type: String,
    required: true,
    unique: true,
  },
  specie: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
}

const lostPetSchema = new Schema(lostPetData)

export const LostPet = mongoose.model<LostPetType>(
  'LostPet',
  lostPetSchema,
  'lostPets'
)
