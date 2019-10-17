const quoteQuery = require('./quoteQuery')
const access_key = 'a63f414885b85328f3e61a58c7c0a7ae';

async function updateQuotes() {
    var result = {
        'status': '',
        'error': ''
    }
    var http = require('http');
    var options = {
        host: 'www.apilayer.net',
        path: '/api/live?access_key=' + access_key + '&format=1'
    };

    var newReq = await http.get(options, function (newRes) {
        var bodyChunks = [];
        newRes.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {

            var body = Buffer.concat(bodyChunks);
            body = JSON.parse(body.toString());
            if(body.success){
                let source = body.source; 
                for(let quote in body.quotes){
                    quoteQuery.truncate(db);
                    var db = {
                        source: source,
                        date: Date.now(),
                        name: quote.substring(3,6),
                        quote: body.quotes[quote],
                    };
                    
                    quoteQuery.addQuote(db);
                }
                result.status = 'OK';
            } else {
                result.status = 'error';
                result.error = 'Erro ao requisitar a moeda';
            }

        })
    });

    newReq.on('error', await function (e) {
        result.status = 'error';
        result.error = e;
    });

    return result;
}

module.exports = { updateQuotes }