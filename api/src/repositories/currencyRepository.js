const { createClient } = require('redis')

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const client = createClient({ socket: { host, port } })

client.connect()

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
  }
}

function createCurrencyRepository() {
  const prefix = 'currency'
  return {
    async add(data) {
      await client.set(`${prefix}:${data.code}`, JSON.stringify(data))
      const { code } = data
      const currency = await this.get(code)

      return currency
    },

    async get(code) {
      const data = await client.get(`${prefix}:${code}`)
      const currency = JSON.parse(data)

      return currency
    },

    async getAll() {
      const getAllCurrenciesKeys = async () => {
        const keys = []
        for await (const key of client.scanIterator({
          MATCH: `${prefix}:*`,
          COUNT: 500,
        })) {
          keys.push(key)
        }

        return keys
      }

      const keys = await getAllCurrenciesKeys()
      const data = await client.sendCommand(['MGET', ...keys])
      const currencies = data.map((d) => JSON.parse(d))

      return currencies
    },

    async update(data) {
      const { code } = data
      const oldCurrency = await this.get(code)
      if (!oldCurrency) {
        throw new NotFoundError('No currency found.')
      }

      const currency = await this.add({ ...oldCurrency, ...data })

      return currency
    },

    async remove(code) {
      return client.del(`${prefix}:${code}`)
    },
  }
}

module.exports = { createCurrencyRepository, NotFoundError }
