const db = require('../../src/config/database/database-connection')

describe('Database', () => {

    it('should receive mongoose conection object if database connection success', async () => {

        const response = await db()

        expect(response.connection.readyState).toBe(1)
    });

    it('should receive mongoose error if database connection string invalid', async () => {
        process.env.DB_URI = 'invalid_uri'

        const response = await db()

        expect(response).toBeInstanceOf(Error)
    });
})