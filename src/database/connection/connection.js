import { MongoClient } from 'mongodb'

export class Connection {
  static client
  static db

  static async connect (databaseUrl = 'mongodb://root:root@localhost:27017') {
    try {
      if (!Connection.client) {
        Connection.client = new MongoClient(databaseUrl)
        await Connection.client.connect()
        Connection.db = Connection.client.db('bravo')
        console.log('successfully connecting')
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async disconnect () {
    Connection.client.close()
  }
}
