const exchangeController = require('../../../src/app//exchange/controller');

describe('ExchangeController tests', () => {

  let ctxMock;
  let router;
  let service;

  beforeEach(() => {
    ctxMock = {
      query: {
        from: 'BRL',
        to: 'USD',
        amount: 100
      }
    }

    router = {
      get: jest.fn(() => Promise.resolve())
    }

    service = {
      calculate: jest.fn()
    }
  })

  describe('when method get id called', () => {
    test('call service.calculate method', () => {
      exchangeController(router, service).then(() => {
        expect(service.calculate).toHaveBeenCalled();
      })
    })
  })
})