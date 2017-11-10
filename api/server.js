// require the dependencies we installed
var app = require('express')();
var responseTime = require('response-time')
var axios = require('axios');
var redis = require('redis');
var bluebird = require("bluebird");

// make node_redis promise compatible
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// create a new redis client and connect to our local redis instance
var client = redis.createClient();

//connect the redis
client.on('connect', () => {
    console.log(`connected to redis`);
});

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

app.set('port', (process.env.PORT || 8080));

// set up the response-time middleware
app.use(responseTime());

//validate the request parameters
function validateParameters(params)
{
	var currencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
    
    if(!(params.hasOwnProperty('from') && params.hasOwnProperty('to') && params.hasOwnProperty('amount'))) return false;

    if(!(params.from != null && params.to != null && params.amount != null)) return false;
	
	if(params.from == params.to || currencies.indexOf(params.from) || currencies.indexOf(params.to)) return false;
	
	return true;
}

// call the currency converter API to fetch information about the currency conversions
function getRateConversion(code) 
{
    var currConvEndpoint = 'https://free.currencyconverterapi.com/api/v4/convert?q='+ code +'&compact=ultra';
    return axios.get(currConvEndpoint);
}

// convert the amount
function convertAmount(rate, amount) 
{
    return (rate * amount).toFixed(2);
}

// get the response data
function getResponseData(from, to, amount, rate)
{
    return { 'from': from, 'to': to, 'amount': amount, 'converted_amount': convertAmount(rate, amount) };
}
  
// if a user visits /api/facebook, return the total number of stars 'facebook'
// has across all it's public repositories on GitHub
app.get('/conversion?from=:from&to=:to&amount=:amount', function(req, res) 
{
	//validate the parameters in the URL
	if(validateParameters(req.params))
		res.status(400).end('Invalid parameters!');
			
    // get the parameters in the URL
    var from   = req.params.from  ;
    var to     = req.params.to    ;
    var amount = req.params.amount;
    var key    = from + '_'+ to   ;

    // use the redis client to get the rate conversion
    // from and to from our redis cache
    client.get(key, function(error, result) 
    {
        if (result) 
        {
            // the result exists in our cache - return it to our user immediately
            res.send(getResponseData(from, to, amount, result));
        } 
        else 
        {
            // we couldn't find the key in our cache, so get it
            // from the currency converter API
            getRateConversion(key)
            .then(function(apiResponse) 
            {
                var rate = apiReponse.data[key];

                // store the key-value pair (key:rate) in our cache
                // with an expiry of 1 day (86400s)
                client.setex(username, 86400, rate);
                // return the result to the user
                res.send(getResponseData(from, to, amount, rate));
            })
            .catch(function(response) 
            {
                if (response.status === 404) 
                {
                res.send('The key doesnt exists!');
                } 
                else
                {
                res.send(response);
                }
            });
        }
    });
});

app.listen(app.get('port'), function(){
  console.log('Server listening on port: ', app.get('port'));
});