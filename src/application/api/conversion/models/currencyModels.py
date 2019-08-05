from src.application.api.restplus import api
from flask_restplus import fields

amountModel = api.model('Amount dict', {
    'amount': fields.String
})

successModel = api.model('Success response', {
    'success': fields.Boolean,
    'data': fields.Nested(amountModel)
})

badRequestErrors = api.model('Bad Request error list',
{
    '<error field>': fields.String
})
badRequestModel = api.model('Bad Request response', {
    'success': fields.Boolean,
    'errors': fields.Nested(badRequestErrors)
})

internalErrorModel = api.model('Internal Server Error response', {
    'success': fields.Boolean,
    'errors': fields.String
})