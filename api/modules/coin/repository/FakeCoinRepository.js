const model = require('../model/model');
class FakeCoinRepository {
    constructor() {
        this.model = model;
    }

    async find(coin) {
        const newCoin = await this.model.findOne({ ticket: coin });
        return newCoin;
    }

    async create(coin) {
        const newCoin = await this.model.create(coin);
        return newCoin;
    }

    async update(coin) {
        const newCoin = await this.model.findOneAndUpdate({ ticket: coin.ticket }, { ticket: coin.newTicket || coin.ticket, currency: coin.currency}, { new: true });
        return newCoin;
    }

    async delete(coin) {
        const deletedCoin = await this.model.findOneAndDelete({ ticket: coin.ticket }, { returnDocument: true });
        return deletedCoin;
    }   
}


module.exports = FakeCoinRepository;