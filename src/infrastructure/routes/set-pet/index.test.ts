import supertest from 'supertest'
import app from '../../../app'
import * as setPetModules from '.'
import { User } from '../../database/models/user'
import { Pet } from '../../database/models/pet'
import { NextFunction, Request, Response } from 'express'

jest.mock('../../../infrastructure/middlewares/jwt', () => ({
  validateJWT: (req: Request, res: Response, next: NextFunction) => {
    return next()
  },
}))

const { setPetsHandler } = setPetModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const mockPetData = {
  accountId: 'fake',
  microchipId: 'fake',
  name: 'fake',
  color: 'fake',
  age: 'fake',
  species: 'fake',
  breed: 'fake',
  size: 'fake',
  description: 'fake',
}

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

describe('Set pet route', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 201 when pet is saved', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      _id: 'fakeUserId',
    })

    Pet.create = jest.fn().mockResolvedValueOnce({})

    let req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.status).toBeCalledWith(201)
    expect(loginResponse.send).toBeCalledWith({})
  })

  it('Should respond 500 when pet is not saved', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      _id: 'fakeUserId',
    })

    Pet.create = jest.fn().mockResolvedValueOnce(undefined)

    let req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.status).toBeCalledWith(500)
    expect(loginResponse.send).toBeCalledWith(undefined)
  })

  it('Should respond 500 when saving pet throws an error', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      _id: 'fakeUserId',
    })

    Pet.create = jest.fn().mockRejectedValueOnce(new Error('errorMessage'))

    let req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.sendStatus).toBeCalledWith(500)
  })

  it('Should respond 400 when no pet data is sent', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when no email is sent', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        petData: mockPetData,
        decoded: {},
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when pet data is empty', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        petData: {},
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 404 when user not found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const loginResponse = await setPetsHandler(User, Pet, req, mockRes)
    expect(loginResponse.sendStatus).toBeCalledWith(404)
  })
})
