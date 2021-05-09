const { Currency } = require("../../src/app/models");
const IntegrationService = require('../../src/app/services/IntegrationService')
const IntegrationController = require('../../src/app/controllers/IntegrationController')
const truncate = require('../../src/utils/truncate')

describe("Format Currency data from api",()=>{
    beforeEach(async () => {
        await truncate();
    });
    it("should create currency", async () => {
        const currency = await Currency.create({
            name:"Moeda teste",
            code:"MT",
            icon:"icone",
            fictional:"true"
        });

        expect(currency.name).toBe("Moeda teste");
    });

    it("Shoud create a bunch of currencies", async ()=>{

        const currencies =[
            {
                currencyName:"Moeda teste 2",
                currencyCode:"MT2",
                icon:"icone2"
            },
            {
                currencyName:"Moeda teste 3",
                currencyCode:"MT3",
                icon:"icone3"
            },
        ]

        const response = await IntegrationService.populate(currencies)
        expect(response.amount).toBeGreaterThan(0)
    })

    it('should get true value  on this routine',async()=>{
        const response = await IntegrationController.getCurrencies()
        expect(response).toBeTruthy();
    })

})