const {Currency} = require('../../src/app/models')
const truncate = require("../../src/utils/truncate");

describe('Database',()=>{
    beforeEach(async () => {
        await truncate();
    });
    it('should create new currency',async()=>{
        const currency = await Currency.create({
            name:"Alfaya",
            code:"Alf",
            value:'250.63',
            icon:"icone",
            fictional:true
        })
        expect(currency.code).toBe('Alf')
    })
})