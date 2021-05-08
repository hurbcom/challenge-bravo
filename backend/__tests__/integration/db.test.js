const {Currency} = require('../../src/models')

describe('Database',()=>{
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