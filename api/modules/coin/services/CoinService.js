const CoinRepository = require('../repository/CoinRepository');
class CoinService {
    constructor() {
        this.coinRepository = new CoinRepository();
    }

    async addCoin(ticket, currency) {
        return this.coinRepository.create({ ticket, currency });
    }

    async updateCoin(ticket, newTicket, currency) {
        return this.coinRepository.update({ ticket, newTicket, currency });
    }

    async delete(ticket) {
        return this.coinRepository.delete({ ticket });
    }
}


module.exports = CoinService;