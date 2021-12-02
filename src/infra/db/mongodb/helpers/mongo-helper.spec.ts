import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  test('should be connected', async () => {
    await sut.connect(process.env.MONGO_URL)
    expect(sut.client).toBeTruthy()
  })
  test('should not be connected', async () => {
    await sut.disconnect()
    expect(sut.client).toBeNull()
  })
  test('should get collection', async () => {
    await sut.connect(process.env.MONGO_URL)
    const accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
