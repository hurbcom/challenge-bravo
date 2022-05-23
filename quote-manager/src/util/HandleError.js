const { toType } = require('.')
const { isNil } = require('lodash')


class HandleError extends Error {

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


    #margeStack = (stack) => {
        return `${stack}\n\n\t...\n\n${this.stack}`
    }
}

module.exports = HandleError