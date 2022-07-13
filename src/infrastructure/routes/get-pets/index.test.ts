import supertest from 'supertest'
import app from '../../../app'
import * as getPetsModules from '.'
import { User } from '../../database/models/user'
import { Pet } from '../../database/models/pet'
import { NextFunction, Request, Response } from 'express'
import axios from 'axios'

jest.mock('../../../infrastructure/middlewares/jwt', () => ({
  validateJWT: (req: Request, res: Response, next: NextFunction) => {
    console.log('FAKEJWT')
    return next()
  },
}))

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const baseRoute = '/api/v1/pets/'
const { getPetsHandler } = getPetsModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

describe('Get pets', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when pets found for user', async () => {
    const foundPetsResponse = [{}]
    User.findOne = jest.fn().mockResolvedValueOnce({
      _id: 'fakeUserId',
    })
    Pet.find = jest.fn().mockResolvedValueOnce(foundPetsResponse)

    let req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const getPetsResponse = await getPetsHandler(User, Pet, req, mockRes)
    expect(getPetsResponse.status).toBeCalledWith(200)
    expect(getPetsResponse.send).toBeCalledWith(foundPetsResponse)
  })

  it('Should respond 404 when no user found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    let req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const getPetsResponse = await getPetsHandler(User, Pet, req, mockRes)
    expect(getPetsResponse.sendStatus).toBeCalledWith(404)
  })

  it('Should respond 401 when no email is sent', async () => {
    const req = {
      body: {
        decoded: {},
      },
    } as Request

    const getPetsResponse = await getPetsHandler(User, Pet, req, mockRes)
    expect(getPetsResponse.sendStatus).toBeCalledWith(401)
  })
})
