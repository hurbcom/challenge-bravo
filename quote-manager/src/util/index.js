
const {createHmac} = require('crypto')
const {isNil, isEmpty, isError} = require('lodash')

exports.toType = (obj) => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

exports.response = (message, status, data = null) => {
    
    return {
        error: status < 200 || status >= 300,
        status: status,
        date: new Date().toISOString(),
        message: message,
        data: isNil(data)? undefined: data
    }
} 

exports.responseError = (err, status = 500, data = {}) =>{
    let message = err 
    if(isError(err)){
        data = {...err.data, ...data}
        data = isEmpty(data)? null: data
        status = !!err.status? err.status: status
        message = err.message
    }

    return this.response(message, status, data)
}
