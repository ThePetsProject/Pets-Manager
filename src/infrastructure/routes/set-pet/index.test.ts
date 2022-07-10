import supertest from 'supertest'
import app from '../../../app'
import * as setPetModules from '.'
import { User } from '../../database/models/user'
import { Pet } from '../../database/models/pet'
import { NextFunction, Request, Response } from 'express'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import validateJwt from '@src/infrastructure/middlewares/jwt'
import { set } from 'lodash'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const baseRoute = '/api/v1/pets/secure'
const { setPetsHandler } = setPetModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const responseTokens = {
  accToken: 'fakeacctoken',
  refToken: 'fakereftoken',
}
const mockTokensResponse = () =>
  mockedAxios.request.mockImplementation(
    (config: AxiosRequestConfig<unknown>) => {
      console.log(config)
      return Promise.resolve()
    }
  )

describe('Set pet route', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      checkPassword: jest.fn().mockResolvedValueOnce(true),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it.only('Should call method when root path', (done) => {
    jest.spyOn(setPetModules, 'setPetsHandler')
    mockTokensResponse()

    request
      .post(`${baseRoute}/`)
      .send({
        accountId: 'fake',
        microchipId: 'fake',
        name: 'fake',
        color: 'fake',
        age: 'fake',
        species: 'fake',
        breed: 'fake',
        size: 'fake',
        description: 'fake',
      })
      .expect(200)
      .then(() => {
        expect(setPetModules.setPetsHandler).toHaveBeenCalled()
        done()
      })
  })

  it('Should respond 200 when password match', async () => {
    mockTokensResponse()

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

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(responseTokens)
  })

  it('Should respond 404 when no user found', async () => {
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

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(404)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 401 when passwords wont match', async () => {
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

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(401)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 if passsword is not a string', async () => {
    const req = {
      body: {
        email: 'fake@email.com',
        password: 123,
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 if email is not an email', async () => {
    const req = {
      body: {
        email: 'notanemail.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 500 if axios returns error', async () => {
    const errorMsg = 'Error message'
    mockedAxios.request.mockRejectedValueOnce(new Error(errorMsg) as AxiosError)

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

    const loginResponse = await setPetsHandler(User, Pet, req, res)
    expect(loginResponse.status).toBeCalledWith(500)
    expect(loginResponse.send).toBeCalledWith({
      message: errorMsg,
    })
  })
})
