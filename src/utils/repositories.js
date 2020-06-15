const Coins = require('./model')

class CoinsRepository {
    constructor(model) {
        this.model = model
    }

    // create a new coin
    create(name, value) {
        const newCoin = { name, value, lastUpdate: new Date().toLocaleString() }
        const coin = new this.model(newCoin)

        return coin.save()
    }

    // return all coins
    findAll() {
        return this.model.find()
    }

    //find coin by the id
    find(query) {
        return this.model.find(query)
    }

    // delete coin
    deleteById(id) {
        return this.model.findOneAndDelete(id)
    }

    //update coin
    updateById(name, value) {
        const query = { name }
        return this.model.findOneAndUpdate(query, {
            $set: {
                name,
                value,
                lastUpdate: new Date().toLocaleString(),
            },
        })
    }
}

module.exports = new CoinsRepository(Coins)
