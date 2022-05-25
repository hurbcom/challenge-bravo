jest.mock('../../src/controller/coin')
const { app } = require('../../src/app')
const request = require('supertest')
const controllerCoin = require('../../src/controller/coin')
const nock = require('nock')

beforeAll(() => {
    if (!nock.isActive()) {
        nock.activate()
    }
})

beforeEach(() => {
    global.HandleError.mockClear()
    controllerCoin.add.mockClear()
    controllerCoin.update.mockClear()
    controllerCoin.delete.mockClear()
    controllerCoin.getCoin.mockClear()
    controllerCoin.getAll.mockClear()
})


describe('It should test router GET api/coin/list.', () => {
    test('It should request list coins with success.', async () => {

        const mockResponse = { "data": ["BRL", "BTC", "HURB"], "date": new Date().toISOString(), "error": false, "message": "Lista de moedas", "status": 200 }

        controllerCoin.getAll.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'getAll')

        await request(app)
            .get('/api/coin/list')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(undefined)
            })
    })

    test('It should request list coins with success but have filter type coin.', async () => {

        const mockResponse = { "data": ["BRL", "BTC"], "date": new Date().toISOString(), "error": false, "message": "Lista de moedas", "status": 200 }

        controllerCoin.getAll.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'getAll')

        await request(app)
            .get('/api/coin/list')
            .query('type=API')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith('API')
            })
    })

    test('It should request list coins with fail.', async () => {

        const mockError = new Error("Error internal")

        const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": true, "message": "Error internal", "status": 500 }

        controllerCoin.getAll.mockRejectedValueOnce(mockError)

        const spy = jest.spyOn(controllerCoin, 'getAll')

        await request(app)
            .get('/api/coin/list')
            .query('type=API')
            .expect(500)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith('API')
            })
    })

})

describe('It should test router GET api/coin/:code.', () => {

    test('It should request get coin with success.', async () => {

        const mockResponse = {
            "error": false,
            "status": 200,
            "date": "2022-05-25T03:03:20.674Z",
            "message": "Moeda encontrada",
            "data": {
                "quote": {
                    "buy": "1.0",
                    "sale": "0.9"
                },
                "coinName": "HURB coins",
                "coinCode": "HURB",
                "type": "FIXE"
            }
        }

        const coinCode = "HURB"

        controllerCoin.getCoin.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'getCoin')

        await request(app)
            .get("/api/coin/" + coinCode)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode)
            })
    })

    test('It should request get coin with fail.', async () => {

        const mockError = new HandleError("Moeda não encontrada", 404, { "coinCode": "HURBA" })

        const mockResponse = { "data": { "coinCode": "HURBA" }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

        const coinCode = "HURBA"

        controllerCoin.getCoin.mockRejectedValueOnce(mockError)

        const spy = jest.spyOn(controllerCoin, 'getCoin')

        await request(app)
            .get("/api/coin/" + coinCode)
            .expect(404)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode)
            })
    })

})

describe('It should test router POST api/coin/.', () => {

    test('It should request create coin with success.', async () => {

        const mockResponse = {
            "error": false,
            "status": 200,
            "date": "2022-05-25T03:03:20.674Z",
            "message": "Moeda encontrada",
            "data": undefined
        }

        const body = {
            "quote": {
                "buy": "1.0",
                "sale": "0.9"
            },
            "coinName": "HURB coins",
            "coinCode": "HURB",
            "type": "FIXE"
        }

        controllerCoin.add.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'add')

        await request(app)
            .post("/api/coin")
            .send(body)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(body)
            })
    })

    test('It should request create coin with fail.', async () => {

        const mockError = new Error("Internal Error")

        const mockResponse = { "data": undefined, "date": new Date().toISOString(), "error": true, "message": "Internal Error", "status": 500 }

        const body = {
            "quote": {
                "buy": "1.0",
                "sale": "0.9"
            },
            "coinName": "HURB coins",
            "coinCode": "HURB",
            "type": "FIXE"
        }

        controllerCoin.add.mockRejectedValueOnce(mockError)

        const spy = jest.spyOn(controllerCoin, 'add')

        await request(app)
            .post("/api/coin")
            .send(body)
            .expect(500)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(body)
            })
    })

})


describe('It should test router PUT api/coin/:code.', () => {

    test('It should request update coin with success.', async () => {

        const mockResponse = {
            "error": false,
            "status": 200,
            "date": "2022-05-25T03:03:20.674Z",
            "message": "Moeda encontrada",
            "data": undefined
        }

        const coinCode = "HURB"

        const body = {
            "quote": {
                "buy": "1.0",
                "sale": "0.9"
            },
            "coinName": "HURB coins",
            "type": "FIXE"
        }

        controllerCoin.update.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'update')

        await request(app)
            .put("/api/coin/" + coinCode)
            .send(body)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode, body)
            })
    })

    test('It should request update coin with fail.', async () => {

        const mockError = new HandleError("Moeda não encontrada", 404, { "coinCode": "HURBA" })

        const mockResponse = { "data": { "coinCode": "HURBA" }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

        const coinCode = "HURBA"

        const body = {
            "quote": {
                "buy": "1.0",
                "sale": "0.9"
            },
            "coinName": "HURB coins",
            "type": "FIXE"
        }

        controllerCoin.update.mockRejectedValueOnce(mockError)

        const spy = jest.spyOn(controllerCoin, 'update')

        await request(app)
            .put("/api/coin/" + coinCode)
            .send(body)
            .expect(404)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode, body)
            })
    })

})

describe('It should test router DELETE api/coin/:code.', () => {

    test('It should request remove coin with success.', async () => {

        const mockResponse = {
            "error": false,
            "status": 200,
            "date": "2022-05-25T03:03:20.674Z",
            "message": "Moeda encontrada",
            "data": {
                "quote": {
                    "buy": "1.0",
                    "sale": "0.9"
                },
                "coinName": "HURB coins",
                "coinCode": "HURB",
                "type": "FIXE"
            }
        }

        const coinCode = "HURB"

        controllerCoin.delete.mockResolvedValueOnce(mockResponse)

        const spy = jest.spyOn(controllerCoin, 'delete')

        await request(app)
            .delete("/api/coin/" + coinCode)
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode)
            })
    })

    test('It should request remove coin with fail.', async () => {

        const mockError = new HandleError("Moeda não encontrada", 404, { "coinCode": "HURBA" })

        const mockResponse = { "data": { "coinCode": "HURBA" }, "date": new Date().toISOString(), "error": true, "message": "Moeda não encontrada", "status": 404 }

        const coinCode = "HURBA"

        controllerCoin.delete.mockRejectedValueOnce(mockError)

        const spy = jest.spyOn(controllerCoin, 'delete')

        await request(app)
            .delete("/api/coin/" + coinCode)
            .expect(404)
            .then(response => {
                expect(response.body).toEqual(mockResponse)
                expect(spy).toHaveBeenCalledTimes(1)
                expect(spy).toHaveBeenCalledWith(coinCode)
            })
    })

})