const CurrenciesService = require('../../src/app/services/CurrenciesService')


describe("Make the math",()=>{
    it("should return currency data", async () => {
        const currency = await CurrenciesService.findOneByCode("BRL")
        expect(currency.code).toBe("BRL");
    });

    it("should create new currency", async () => {
        const mock = {
            "name":"Moeda alfaya",
            "code":"Alf",
            "icon":"icone",
            "value":"200.63",
            "fictional":true
        }
        const currency = await CurrenciesService.create(mock)
        expect(currency.code).toBe("Alf");
    });
})