const fs = require('fs');
module.exports = JSON.parse(fs.readFileSync('coins.json'));