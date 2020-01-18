var request = require("request");

exports.get = async (req, res, next) => {
  console.log("chamando");
  res.json({
    title: 'teste',
    msg: 'msg'
  });
};