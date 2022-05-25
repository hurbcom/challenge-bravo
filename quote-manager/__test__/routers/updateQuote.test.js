jest.mock('../../src/controller/updateQuotation')
const { app } = require('../../src/app')
const request = require('supertest')
const controllerUpdateQuote = require('../../src/controller/updateQuotation')
const nock = require('nock')

beforeAll(()=>{
    if (!nock.isActive()) {
        nock.activate()
    }
})

beforeEach(() => {
    global.HandleError.mockClear()
    controllerUpdateQuote.manual.mockClear()
})

test('It should test request from router responsibility start update Quote from api.', async () => {

    controllerUpdateQuote.byAPI.mockResolvedValueOnce(["OK", "OK"])

    await request(app)
        .put('/api/quote')
        .expect(200).then(response => {
            expect(response.body).toEqual('Requisição recebida')
        })
})

test('It should test request from router responsibility start update Quote from api but return error.', async () => {

    const mockError = new Error("Error internal")

    const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": true, "message": "Error internal", "status": 500 }

    controllerUpdateQuote.byAPI.mockRejectedValueOnce(mockError)

    await request(app)
        .put('/api/quote')
        .expect(500)
        .then(response => {
            expect(response.body).toEqual(mockResponse)
        })
})

test('It should test request from router responsibility update Quote manually', async () => {

    const mock_response = { "data": undefined, "date": new Date().toISOString(), "error": false, "message": "Cotação atualizada manualmente", "status": 200 }

    controllerUpdateQuote.manual.mockResolvedValueOnce(mock_response)

    const spy = jest.spyOn(controllerUpdateQuote, 'manual')

    const quote = { coinCode: 'BTC', buy: "20.92", sale: "20.67" }
    const { coinCode: coin, buy, sale } = quote
    const body = { coin, buy, sale }

    await request(app)
        .put('/api/quote/manual')
        .send(body)
        .expect(200).then(response => {
            expect(response.body).toEqual(mock_response)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(quote)
        })
})


test('It should test request from router responsibility update Quote manually not find coin', async () => {

    const mockHandleError = new HandleError("Moeda não encontrada", 404, { "coinCode": "HURB" })

    const mock_response = { "data": { "coinCode": "HURB" }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

    controllerUpdateQuote.manual.mockRejectedValueOnce(mockHandleError)

    const spy = jest.spyOn(controllerUpdateQuote, 'manual')

    const quote = { coinCode: 'BTC', buy: "20.92", sale: "20.67" }
    const { coinCode: coin, buy, sale } = quote
    const body = { coin, buy, sale }

    await request(app)
        .put('/api/quote/manual')
        .send(body)
        .expect(404).then(response => {
            expect(response.body).toEqual(mock_response)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(quote)
        })
})