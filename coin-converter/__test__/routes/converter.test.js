jest.mock('../../src/controller/converter.js')
const { app } = require('../../src/app')
const request = require('supertest')
const controllerConverter = require('../../src/controller/converter')


beforeEach(() => {
    global.HandleError.mockClear()
    controllerConverter.calculate.mockClear()
})

test('It should request list coins with success.', async () => {

    const expected = {
        "error": false,
        "status": 200,
        "date": new Date().toISOString(),
        "message": "Calculado com sucesso",
        "data": {
            "quoteFrom": 1.0697,
            "quoteTo": 0.2073,
            "valueCalculate": 516.015436565,
            "type": "buy"
        }
    }

    const requestValue = { from: "EUR", to: "BRL", value: "100.00", type: "buy" }

    controllerConverter.calculate.mockResolvedValueOnce(expected)

    const spy = jest.spyOn(controllerConverter, 'calculate')

    await request(app)
        .get('/api/converter')
        .query('from=EUR&to=BRL&value=100.00&type=buy')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(expected)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(requestValue)
        })
})

test('It should request list coins with success.', async () => {

    const expected = {
        "error": true,
        "status": 404,
        "date": new Date().toISOString(),
        "message": "Moeda não disponivel para conversão",
        "data": {"coinCode": "EURA"}
    }

    const requestValue = { from: "EURA", to: "BRL", value: "100.00", type: "buy" }

    controllerConverter.calculate.mockRejectedValueOnce(new HandleError("Moeda não disponivel para conversão" ,404, {coinCode: "EURA"}))

    const spy = jest.spyOn(controllerConverter, 'calculate')

    await request(app)
        .get('/api/converter')
        .query('from=EURA&to=BRL&value=100.00&type=buy')
        .expect(404)
        .then(response => {
            expect(response.body).toEqual(expected)
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(requestValue)
        })
})