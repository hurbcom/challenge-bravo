const CurrenciesService = require('../../src/app/services/CurrenciesService')


describe("Make the math",()=>{
    it("should return currency data", async () => {
        const currency = await CurrenciesService.findOneByCode("BRL")
        expect(currency.code).toBe("BRL");
    });
})