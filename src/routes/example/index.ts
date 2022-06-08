import express, { Router } from 'express'
const router = express.Router()

export const exampleRoute = (): Router => {
  return router.get('example', (req, res) => {
    return res.status(200).send('This is the example route response')
  })
}
