

const apiQuote = require('../../src/api/quote')
const CONST = require('../../src/properties')
const nock = require('nock')

beforeAll(() => {
    if (!nock.isActive()) {
        nock.activate()
    }
})

beforeEach(() => {
    nock.cleanAll()
})

test('It should request with success multiple quotation.', async () => {
    const mock_coins = ["BTC-USD", "EUR-USD"]

    const mock_response = {
        "EURUSD": {
            "code": "EUR",
            "codein": "USD",
            "name": "Euro/Dólar Americano",
            "high": "1.0599",
            "low": "1.0533",
            "varBid": "-0.0024",
            "pctChange": "-0.23",
            "bid": "1.056",
            "ask": "1.0564",
            "timestamp": "1653080390",
            "create_date": "2022-05-20 17:59:50"
        },
        "BTCUSD": {
            "code": "BTC",
            "codein": "USD",
            "name": "Bitcoin/Dólar Americano",
            "high": "30.546",
            "low": "28.702",
            "varBid": "-861.6",
            "pctChange": "-2.86",
            "bid": "29.241",
            "ask": "29.242",
            "timestamp": "1653109577",
            "create_date": "2022-05-21 02:06:17"
        }
    }

    nock(CONST.API_QUOTE_URL)
        .get(CONST.API_QUOTE_LAST_PATH + mock_coins.join(','))
        .reply(200, mock_response)

    const EXPECTED = [{ "ask": "29.242", "bid": "29.241", "code": "BTC" }, { "ask": "1.0564", "bid": "1.056", "code": "EUR" }]
    const received = await apiQuote.getQuoteUpdated(mock_coins)

    expect(received).toEqual(EXPECTED)
})

test('It should request with fail multiple quotation, because BTC-ABC is not coin valid.', async () => {
    const mock_coins = ["BTC-ABC", "EUR-USD"]

    const mock_response = {
        "status": 404,
        "code": "CoinNotExists",
        "message": "moeda nao encontrada BTC-ABC"
    }

    nock(CONST.API_QUOTE_URL)
        .get(CONST.API_QUOTE_LAST_PATH + mock_coins.join(','))
        .reply(404, mock_response)

    const received = apiQuote.getQuoteUpdated(mock_coins)

    // await expect(received).rejects.toEqual(EXPECTED)
    await expect(received).rejects.toThrowError()
    expect(HandleError).toHaveBeenCalledTimes(1)
    expect(HandleError).toHaveBeenCalledWith('Request failed with status code 404',404,mock_response)
})