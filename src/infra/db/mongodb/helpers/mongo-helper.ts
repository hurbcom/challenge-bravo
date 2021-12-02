import { Collection, MongoClient, MongoClientOptions } from 'mongodb'
export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },
  async getCollection <T> (name: string): Promise<Collection<T>> {
    if (!this.client?.isConnected) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },
  map: (collection: any): any => {
    const { _id, ...collectionWOId } = collection
    const result = Object.assign({}, collectionWOId, { id: _id })
    if (typeof result.id !== 'string') {
      result.id = result.id.toString()
    }
    return result
  }
}
