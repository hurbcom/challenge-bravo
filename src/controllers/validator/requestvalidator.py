from models.requestmodel import *
from exceptions.apiexceptions import InvalidParametersException,DatabaseException

class RequestValidator():
    def validateConvertRequestArgs(args):
        from_currency = args.get('from',type=str)
        to_currency = args.get('to',type=str)
        amount = args.get('amount',type=int)
        model = ConvertRequestModel(to_currency,from_currency,amount)
        if(model.isDataNull()):
            raise InvalidParametersException()
        return model

    def validateCurrencyGetRequestArgs(args):
        name = args.get('name',type=str)
        model = CurrencyGetRequestModel(name)
        if(model.isDataNull()):
            raise InvalidParametersException()
        return model

    def validateCurrencyPutRequestArgs(args):
        name = args.get('name',type=str)
        value = args.get('value',type=str)
        model = CurrencyPutRequestModel(name,value)
        if(model.isDataNull()):
            raise InvalidParametersException()
        return model

