const { Container } = require('typedi');

const ICoinService = require('../../../src/services/coin-service-interface');

describe('Coin Gecko API', () => {
    const coinGeckoInterface = Container.get(ICoinService);

    it('Should return a valid object (async version)', async () => {
        const result = await coinGeckoInterface.getAll();

        expect(result).toBeDefined();
    });
});
