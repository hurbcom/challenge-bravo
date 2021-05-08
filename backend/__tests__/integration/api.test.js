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
        console.log(currency)

        expect(currency.code).toBe('Alf')
    })
})