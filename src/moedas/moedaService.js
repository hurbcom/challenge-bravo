const Moeda = require('./moeda')


Moeda.methods(['get', 'post', 'put', 'delete'])

Moeda.updateOptions({new: true, runValidators: true})

module.exports = Moeda