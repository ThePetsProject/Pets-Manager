import * as editPetsModules from '.'
import { Pet } from '../../database/models/pet'
import { NextFunction, Request, Response } from 'express'

jest.mock('../../../infrastructure/middlewares/jwt', () => ({
  validateJWT: (req: Request, res: Response, next: NextFunction) => {
    console.log('FAKEJWT')
    return next()
  },
}))

const { editPetsHandler } = editPetsModules

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

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

describe('Login route', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when pet data edited', async () => {
    Pet.updateOne = jest.fn().mockResolvedValueOnce({})

    const req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const editPetResponse = await editPetsHandler(Pet, req, mockRes)
    expect(editPetResponse.status).toBeCalledWith(200)
    expect(editPetResponse.send).toBeCalledWith({})
  })

  it('Should respond 400 when no pet data is sent', async () => {
    const req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const editPetsResponse = await editPetsHandler(Pet, req, mockRes)
    expect(editPetsResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when no email is sent', async () => {
    const req = {
      body: {
        petData: mockPetData,
        decoded: {},
      },
    } as Request

    const editPetsResponse = await editPetsHandler(Pet, req, mockRes)
    expect(editPetsResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when pet data is empty', async () => {
    const req = {
      body: {
        petData: {},
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const editPetsResponse = await editPetsHandler(Pet, req, mockRes)
    expect(editPetsResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 500 when save pet fails', async () => {
    Pet.updateOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        petData: mockPetData,
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const editPetsResponse = await editPetsHandler(Pet, req, mockRes)
    expect(editPetsResponse.sendStatus).toBeCalledWith(500)
  })
})
