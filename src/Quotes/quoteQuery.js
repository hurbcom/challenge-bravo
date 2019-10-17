const Quote = require('./quote');


function truncate() {
    Quote.deleteMany({}, function(err) {});
}

function addQuote(db){
    var data = new Quote(db);
    data.save();
}

module.exports = { truncate, addQuote }
