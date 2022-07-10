import express from 'express'
import cors, { CorsOptions } from 'cors'
import { routesArray, routesArrayNosecure } from './infrastructure/routes'
import dotenv from 'dotenv'
import { healthRoute } from './infrastructure/routes/health'
import validateJWT from './infrastructure/middlewares/jwt'
import { getBreedsRoute } from './infrastructure/routes/get-breeds'
import { Breed } from '@database/models/breed'
import { setLostPetsRoute } from './infrastructure/routes/set-lost-pet'
import { LostPet } from './infrastructure/database/models/lost-pet'

declare global {
  namespace Express {
    interface Request {
      email: string
    }
  }
}

dotenv.config()

const app = express()
const router = express.Router()

const corsOptions: CorsOptions = {
  origin: process.env.ENV === 'PRODUCTION' ? 'https://thepetsproject.tk' : '*',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/pets/health', healthRoute(router))
app.use('/api/v1/pets/secure', validateJWT, routesArray(router))
app.use('/api/v1/pets', routesArrayNosecure(router))

export default app
