const CoinRepository = require('../repository/FakeCoinRepository');
class CoinService {
    constructor() {
        this.coinRepository = new CoinRepository();
    }

    tratarRetorno(coin) {
        return { ticket: coin.ticket, currency: coin.currency };
    }

    async getCoin(ticket) {
        return this.tratarRetorno(await this.coinRepository.find(ticket));
    }

    async addCoin(ticket, currency) {
        return this.tratarRetorno(await this.coinRepository.create({ ticket, currency }));
    }

    async updateCoin(ticket, newTicket, currency) {
        return this.tratarRetorno(await this.coinRepository.update({ ticket, newTicket, currency }));
    }

    async delete(ticket) {
        return this.tratarRetorno(await this.coinRepository.delete({ ticket }));
    }
}


module.exports = CoinService;