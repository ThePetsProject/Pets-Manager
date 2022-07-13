import * as uuid from 'uuid'
import * as setLostPetModules from '.'
import { User } from '../../database/models/user'
import { Request, Response } from 'express'
import axios from 'axios'
import { LostPet } from '@src/infrastructure/database/models/lost-pet'

jest.mock('uuid')
const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('fakeuuid')

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const baseRoute = '/api/v1/pets/lost'
const { setLostPetHandler } = setLostPetModules

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const fakeLostPetData = {
  petId: 'fakepetId',
  specie: 'fakespecie',
  size: 'fakesize',
  status: 'fakestatus',
  lng: 10,
  lat: 10,
}

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

describe('Set lost pet', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 201 when lost pet saved', async () => {
    LostPet.create = jest.fn().mockResolvedValueOnce({})

    let req = {
      body: {
        petData: fakeLostPetData,
      },
    } as Request

    const expectedCall = {
      ...fakeLostPetData,
      petId: 'fakeuuid',
    }

    const lostPetResponse = await setLostPetHandler(LostPet, req, mockRes)
    expect(lostPetResponse.status).toBeCalledWith(201)
    expect(lostPetResponse.send).toBeCalledWith()
    expect(LostPet.create).toBeCalledWith(expectedCall)
  })

  it('Should respond 500 when lost pet saved error', async () => {
    LostPet.create = jest.fn().mockReturnValue(undefined)

    let req = {
      body: {
        petData: fakeLostPetData,
      },
    } as Request

    const lostPetResponse = await setLostPetHandler(LostPet, req, mockRes)
    expect(lostPetResponse.status).toBeCalledWith(500)
    expect(lostPetResponse.send).toBeCalledWith()
  })

  it('Should respond 400 when no pet data is sent', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {},
    } as Request

    const lostPetResponse = await setLostPetHandler(LostPet, req, mockRes)
    expect(lostPetResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when pet data is empty', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        petData: {},
      },
    } as Request

    const lostPetResponse = await setLostPetHandler(LostPet, req, mockRes)
    expect(lostPetResponse.sendStatus).toBeCalledWith(400)
  })
})
