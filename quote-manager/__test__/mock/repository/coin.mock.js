const { Types } = require('mongoose')

exports.MOCK_COIN_MODEL = () => {
    return {
        "_id": Types.ObjectId("628c522d7977dd1726920727"),
        "coinCode": "HURB",
        "coinName": "HURB coin",
        "type": "FIXE",
        "quote": {
            "buy": "1.0",
            "sale": "0.9"
        },
        "__v": 0
    }
}

exports.MOCK_COIN = () => {
    return {
        "coinCode": "HURB",
        "coinName": "HURB coin",
        "type": "FIXE",
        "quote": {
            "buy": "1.0",
            "sale": "0.9"
        },
    }
}

exports.MOCK_RETURN_UPDATE = (option = {}) => {
    return {
        acknowledged: true,
        modifiedCount: option.mfCount == 0 ? 0 : option.mfCount || 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1
    }
}

exports.MOCK_RETURN_DELETE = (option = {}) => {
    return { acknowledged: true, deletedCount: 1 }
}

exports.MOCK_ERROR_MONGO = (options = {}) => {
    const error = new Error(options.message || 'Algum error quando foi salvar')
    error.name = options.name || 'MongoError'
    return error
}

exports.MOCK_HANDLE_ERROR = (options = {}) => {
    const err = new Error("Moeda não encontrada")
    err.status = 404
    err.data = { "coinCode": "HURB" }
    return err
}