export default class Currency {
    constructor (Database) {
        this.Database = Database;
    }

    async listAll () {
        try {
            const result = await this.Database.query('SELECT * FROM currency');

            return result.map(item => item.symbol);
        } catch (err) {
            throw err;
        }
    }
};