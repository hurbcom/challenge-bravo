const { default: Container } = require('typedi');
const ICoinService = require('../../src/services/coin-service-interface');

describe('Coin Gecko API', () => {
    const coinGeckoInterface = Container.get(ICoinService);
    test('It should return a valid object', () => {
        expect(coinGeckoInterface.getAll()).toBeDefined();
    });
});
