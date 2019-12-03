const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ coins: [] }).write();

exports.setCoin = coin => {
    //Verifica se a moeda já existe no DB
    let coinExist = db
        .get("coins")
        .find({ title: coin })
        .value();

    //Se não existir cria no DB.JSON
    if (coinExist == undefined) {
        const postId = db
            .get("coins")
            .push({ id: shortid.generate(), title: coin, active: true })
            .write();
    }
};

exports.deleteCoin = id => {
    //Deleta a coin do DB
    let coinExist = db
        .get("coins")
        .remove({ id: id })
        .write();

    return coinExist;
};

exports.findCoin = coin => {
    //Verifica se a moeda já existe no DB
    let coinExist = db
        .get("coins")
        .find({ title: coin })
        .value();
    return coinExist;
};

exports.getCoins = () => {
    //Lista todas as moedas do DB
    let coinExist = db.get("coins").value();
    return coinExist;
};
