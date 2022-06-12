import * as loginMethods from '.'
import { User } from '../../infrastructure/database/models/user'
import express, { Request, Response } from 'express'

jest.mock('express', () => ({
  Router: () => ({
    post: jest.fn().mockImplementation(() => {}),
  }),
}))

const router = express.Router()
const { loginRoute, loginHandler } = loginMethods

describe('Login route', () => {
  it('Should call method when root', async () => {
    jest
      .spyOn(loginMethods, 'loginHandler')
      .mockResolvedValueOnce({} as Response)
    loginRoute(router, User)
    expect(router.post).toHaveBeenCalledWith('/', expect.any(Function))
  })

  it('Should respond 200 when password match', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      checkPassword: jest.fn().mockResolvedValueOnce(true),
    })

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 when no user found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 when passwords wont match', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      checkPassword: jest.fn().mockResolvedValueOnce(false),
    })

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })
})
