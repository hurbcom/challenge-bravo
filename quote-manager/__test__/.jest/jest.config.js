jest.mock('../../src/util/HandleError')
global.HandleError = require('../../src/util/HandleError')
HandleError.mockImplementation((message, status, data)=>{
    return new Error(message)
})