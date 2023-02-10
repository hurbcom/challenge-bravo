import { RequestError } from 'Utils'

describe('Request Error', () => {
  it('Should return OK to default params', () => {
    const error = new RequestError('')

    expect(error.message).toBe("There's a problem with your request")
    expect(error.statusCode).toBe(500)
  })
})
