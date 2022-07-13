import * as getBreedsModules from '.'
import { User } from '../../database/models/user'
import { Request, Response } from 'express'
import { Breed } from '@src/infrastructure/database/models/breed'

const { getBreedsHandler } = getBreedsModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

describe('Login route', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {})

  it('Should respond 200 with breeds results', async () => {
    Breed.aggregate = jest.fn().mockResolvedValueOnce([{}])

    const req = {
      body: {},
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await getBreedsHandler(Breed, req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith([{}])
  })
})
