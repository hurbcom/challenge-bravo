const mock = require('mock-require');

mock('axios', { 
    get: async (url) => {        
        if(url.includes("https://economia.awesomeapi.com.br/last/BRL-USD")) {            
            return {
                data: {
                    "BRLUSD": {
                        "code": "BRL",
                        "codein": "USD",
                        "name": "Real Brasileiro/Dólar Americano",
                        "high": "0.1948",
                        "low": "0.1947",
                        "varBid": "0.0001",
                        "pctChange": "0.05",
                        "bid": "0.1947",
                        "ask": "0.1947",
                        "timestamp": "1680126152",
                        "create_date": "2023-03-29 18:42:32"
                    }
                }
            }
        }
    }
});


const CurrencyConversionImpl = require("../src/impl/currency-conversion-impl").default;
const expect = require('expect.js');

const fs = require("fs");


class CurrencyConversionImplTest extends CurrencyConversionImpl {
    run() {
        describe('CurrencyConversionImpl', async () => {
            it('findCurrencyEntityInConfigs', async () => {
                const configs = JSON.parse(fs.readFileSync(process.cwd() + "\\src\\jsons\\configs.json").toString());                
                const currencyEntity = this.findCurrencyEntityInConfigs("USD", configs);

                expect(currencyEntity).to.not.be.equal(null);
                expect(currencyEntity.abbreviation).to.be.an('string');
                expect(currencyEntity.abbreviation).to.be.equal("USD");
                expect(currencyEntity.isFictional).to.not.be.equal(null);
                expect(currencyEntity.isFictional).to.be.a('boolean');
                expect(currencyEntity.isFictional).to.not.be.ok();                
            });

            it('getQuotationFromThirdParty', async () => {
                const response = await this.callThirdPartyApi("BRL-USD");
                
                expect(response).to.not.be.equal(null);
                expect(response).to.have.keys(["code","codein","name","high","low","varBid","pctChange","bid","ask","timestamp","create_date"]);
                expect(response.code).to.be.an("string");
                expect(response.code).to.be.equal("BRL");

                expect(response.code).to.be.an("string");
                expect(response.codein).to.be.equal("USD");
            })
          });
    }
}

const currencyConvertionImplTest = new CurrencyConversionImplTest();

currencyConvertionImplTest.run();

