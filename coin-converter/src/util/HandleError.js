const { toType } = require('.')
const { isNil } = require('lodash')

/**
 * Classe que estende a classe de Error
 * Para transitar mais informações pelo throw    
 * @author Fellipe Maia
 */
class HandleError extends Error {
    
    /**
     * 
     * @param {*} message Mensagem de error || Error<Object> 
     * @param {Number} status Status code a ser transmitido default 500
     * @param {*} data Campo para adicionar o payload
     * @author Fellipe Maia
     */
    constructor(message, status = 500, data = null) {
        super(message)
        this.status = status
        if (toType(data) == 'object' || isNil(data))
            this.data = data

        if (toType(message) == 'error') {
            const error = message
            if (!isNil(error.status))
                this.status = error.status
            if (toType(error.data) == 'object')
                this.data = { ...error.data, ...(this.data || {}) }

            this.stack = this.#margeStack(error.stack)
        }
    }

    /**
     * Tem o objetivo de mesclar os stackTraces para que não haja perda de informação
     * @param {String} stack stacktrace do error recebido no construtor
     * @author Fellipe Maia
     * @returns stacktrace mesclado
     */
    #margeStack = (stack) => {
        return `${stack}\n\n\t...\n\n${this.stack}`
    }
}

module.exports = HandleError