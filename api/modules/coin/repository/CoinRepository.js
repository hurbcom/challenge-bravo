const model = require('../model/model');
class FakeCoinRepository {
    constructor() {
        this.model = model;
    }

    async create(coin) {
        const newCoin = await this.model.create(coin);
        return newCoin;
    }

    async update(coin) {
        const newCoin = await this.model.findOneAndUpdate({ ticket: coin.ticket }, { ticket: coin.newTicket, currency: coin.currency}, { new: true });
        return newCoin;
    }

    async delete(coin) {
        const newCoin = await this.model.findOneAndDelete({ ticket: coin.ticket }, { returnDocument: true });
        return;
    }   
}


module.exports = FakeCoinRepository;