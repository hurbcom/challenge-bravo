const { createClient } = require('redis')

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const client = createClient({ socket: { host, port } })

client.connect()

const prefix = 'currency'

async function addCurrency(data) {
  await client.set(`${prefix}:${data.code}`, JSON.stringify(data))
  const { code } = data
  const currency = await getCurrency(code)

  return currency
}

async function getCurrency(code) {
  const data = await client.get(`${prefix}:${code}`)
  const currency = JSON.parse(data)

  return currency
}

async function getAllCurrencies() {
  const keys = await getAllCurrenciesKeys()
  const data = await client.sendCommand(['MGET', ...keys])
  const currencies = data.map((d) => JSON.parse(d))

  return currencies
}

async function updateCurrency(code, data) {
  const oldCurrency = await getCurrency(code)
  const currency = await addCurrency({ ...oldCurrency, ...data })

  return currency
}

async function deleteCurrency(code) {
  return client.del(`${prefix}:${code}`)
}

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

module.exports = {
  addCurrency,
  getCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency,
}
