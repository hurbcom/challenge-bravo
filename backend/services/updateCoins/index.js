const { Helper } = require('../../lib/util');
const { validCoins } = require('../../models/schemas/validCoins');

class UpdateCoin {
  static async add(req, res) {
    let result;
    let id;
    let obj;
    try {
      let { add } = req.query;
      // let add = "BTC" 1
      let find = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0];

      if (find == null) {
        obj = {
          validCoins: [add],
          ip: `${req.ip}`,
          creationDate: Helper.saveDateMongo(),
          updateDate: Helper.saveDateMongo(),
        };
        await validCoins(obj).save();
        result = 'Primeira Moeda cadastrada';
      }
      if (find.validCoins.indexOf(add) >= 0) {
        result = 'Moeda já cadastrada';
      } else {
        obj = {
          validCoins: find.validCoins.concat([add]),
          ip: `${req.ip}`,
          // creationDate: find.creationDate,
          updateDate: Helper.saveDateMongo(),
        };
        console.log(new Date());
        console.log(find.id);
        await validCoins.updateOne({ _id: find.id }, obj);
        result = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0]
          .validCoins;
      }
    } catch (e) {
      result = e.message;
      res.send();
    } finally {
      res.send(result);
    }
  }
  static async delete(req, res) {
    let result;
    let obj;
    try {
      let { add } = req.query;
      let find = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0];
      console.log(find);

      // find.validCoins.splice(find.validCoins.indexOf('usd'), 1);
      let array = find.validCoins;
      console.log(array);
      // console.log(array.indexOf('usd'));// array.splice(array.indexOf('usd'), 1);
      array.splice(array.indexOf(add), 1);
      console.log(array);

      obj = {
        validCoins: array,
        ip: `${req.ip}`,
        // creationDate: Helper.saveDateMongo,
        updateDate: Helper.saveDateMongo(),
      };
      await validCoins.updateOne({ _id: find.id }, obj);
      let confirm = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0]
        .validCoins;
      // console.log(confirm);
      // confirm.indexOf(add) < 0;
      // console.log(confirm.indexOf(add) < 0);
      if (confirm.indexOf(add) < 0) {
        result = `Moeda ${add} removida com sucesso`;
      } else {
        result = 'Ocorreu um erro de processamento.';
      }
    } catch (e) {
      console.log(e);
      result = e.message;
    } finally {
      res.send(result);
    }
  }
}

module.exports.UpdateCoin = UpdateCoin;
