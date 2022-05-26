
const OriginalHandleError = require('../../src/util/HandleError')
global.HandleError = jest.fn()
global.HandleError.mockImplementation((message, status=null, data=null)=>{
    return new OriginalHandleError(message, status, data)
})

const OriginalDate = global.Date
const dateISO = new Date().toISOString()
global.Date = class extends OriginalDate{
    constructor(date = dateISO){
        super(date)
    }

    static now(){
        return new OriginalDate(dateISO).getTime()
    }
}