import { UserType } from '@src/infrastructure/database/models/user'
import { Router } from 'express'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import Joi from 'joi'

export type LoginRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
) => Router

export const loginHandler = async (
  user: mongoose.Model<UserType>,
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error, value } = schema.validate({ email, password })

  if (error) {
    console.log(JSON.stringify(error))
    return res.status(400).send()
  }

  const userExists = await user.findOne({
    email: email.toLowerCase().trim(),
  })

  if (!userExists) return res.status(404).send()

  const pwdCheck = await userExists.checkPassword(password)

  if (!pwdCheck) {
    return res.status(401).send()
  }

  return res.status(200).send()
}

export const loginRoute: LoginRouteFnType = (
  router: Router,
  user: mongoose.Model<UserType>
): Router => {
  return router.post('/', (req, res) => loginHandler(user, req, res))
}
