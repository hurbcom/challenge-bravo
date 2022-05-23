
const CONST = require('../properties')
const {createHmac} = require('crypto')
const {isNil, isEmpty, isError} = require('lodash')
// const { resolve } = require('path')

exports.encrypt = (phase)=>{
    const hmac = createHmac('sha512', CONST.SHH_SYSTEM,{encoding:'utf8'})
    hmac.update(String(phase))
    return hmac.digest('base64')
}

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

exports.responseError = (err, status = 500, data = null) =>{
    let message = err 
    if(isError(err)){
        data = {...err.data, ...data}
        data = isEmpty(data)? null: data
        status = !!err.status? err.status: status
        message = err.message
    }

    return this.response(message, status, data)
}

exports.regexMAC = /(?:^(?:(?:[0-9a-f]{2}[-:]){5}(?:[0-9a-f]{2}){1})$)|(?:^(?:[0-9a-f]{2}[-:]){0,5}\*$)/i

exports.delay = async (timeout)=>{
    return await new Promise((resolve, reject) =>{
        setTimeout(() => {
            console.log('Fim do delay de '+timeout+'ms')
            resolve('ok')
        }, timeout);
    })
}