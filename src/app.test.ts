import request from 'supertest'
import app from './app'

describe('Test the api paths', () => {
  it('It should response the GET method for api/example with 200 code', (done) => {
    request(app)
      .get('/api/v1/example')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      })
  })
  test('It should response the GET method for wrong path with 404 code', (done) => {
    request(app)
      .get('/wrong')
      .then((response) => {
        expect(response.statusCode).toBe(404)
        done()
      })
  })
})
