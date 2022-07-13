import * as getLostPetModules from '.'
import { Response } from 'express'
import { LostPet } from '@src/infrastructure/database/models/lost-pet'

const { getLostPetsHandler } = getLostPetModules

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

describe('Get lost pet', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {})

  it('Should respond 200 with all lost pets', async () => {
    LostPet.find = jest.fn().mockResolvedValueOnce([{}])

    const loginResponse = await getLostPetsHandler(LostPet, mockRes)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith({
      lostPets: [{}],
    })
  })
})
