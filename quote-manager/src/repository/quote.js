const Mongoose = require('mongoose')
const { models } = Mongoose

exports.getCoinsApiUpdate = () => {
    const query = {type: "API"}
    const project = {_id: 0, coinCode: 1}
    return models.QuoteModel.find(query, project)
}
