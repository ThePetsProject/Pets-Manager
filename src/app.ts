import express from 'express'
import cors, { CorsOptions } from 'cors'
import { routesArray } from './infrastructure/routes'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const router = express.Router()

const corsOptions: CorsOptions = {
  origin: 'https://thepetsproject.tk',
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/account/login', routesArray(router))

export default app
