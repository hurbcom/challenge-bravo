var querystring = require('querystring')
var https = require('https')

var host = 'economia.awesomeapi.com.br';

function getValue (from, to, success) {
  var headers = {
    'content-type':'application/json; charset=utf-8'
  }
  let endpoint ='/json/';
   
  endpoint += from + '-' + to;
  var options = {
    host: host,
    path: endpoint,
    method: "GET",
    headers: headers
  };
  var req = https.request(options, function (res) {
    let responseString = ''

    res.on('data', function (data) {
     responseString += data
    })

    res.on('end', function () {
      console.log(responseString)
      let responseObject = JSON.parse(responseString)
      success(responseObject)
    })
  })
  req.end()
}

module.exports = { getValue };
