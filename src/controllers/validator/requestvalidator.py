from models.requestmodel import RequestModel

class RequestValidator():
    def validateConvertRequestArgs(args):
        from_currency = args.get('from',type=str)
        to_currency = args.get('to',type=str)
        amount = args.get('amount',type=int)
        model = RequestModel(to_currency,from_currency,amount)
        if(model.isDataNull()):
            raise Exception('parametros invalidos')
