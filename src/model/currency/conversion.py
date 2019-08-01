from decimal import Decimal

class Conversion():
    def __init__(self, dataDict):
        self.from_ = dataDict['from']
        self.to = dataDict['to']
        self.amount = dataDict['amount']

    def __repr__(self):
        return '<Conversion(from={self.from},to={self.to},amount={self.amount})>'.format(self=self)

    @staticmethod
    def _validate_currency(dict_, field, validCurrencies, isRequired=False):
        validation = {'valid': True, 'error': None}

        if isRequired:
            if not field in dict_:
                validation['valid'] = False
                validation['error'] = '{field} is required'.format(field=field)

                return validation
        else:
            if not field in dict_:
                return validation

        value = dict_[field]

        if not value in validCurrencies:
            validation['valid'] = False
            validation['error'] = '{field} ({value}) is invalid among permitted currencies: {validCurrencies}'.format(field=field, value=value, validCurrencies=validCurrencies)

        return validation
    
    @staticmethod
    def _validate_amount(dict_, field, isRequired=False):
        validation = {'valid': True, 'error': None}

        if isRequired:
            if not field in dict_:
                validation['valid'] = False
                validation['error'] = '{field} is required'.format(field=field)
                
                return validation
        else:
            if not field in dict_:
                return validation

        value = None
        try:
            value = Decimal(dict_[field])
        except:
            validation['valid'] = False
            validation['error'] = '{field} ({value}) is an invalid positive decimal. Use ''.'' for decimal separator'.format(field=dict_[field], value=value)
            return validation

        if not isinstance(value, Decimal) or value < 0:
            validation['valid'] = False
            validation['error'] = '{field} ({value}) must be a positive decimal'.format(field=field, value=value)
        return validation
    
    @staticmethod
    def is_valid(conversionDict, validCurrencies):
        errors = {}

        fromValidation = Conversion._validate_currency(conversionDict, 'from', validCurrencies, errors)
        if not fromValidation['valid']:
            errors['from'] = fromValidation['error']

        toValidation = Conversion._validate_currency(conversionDict, 'to',   validCurrencies, errors)
        if not toValidation['valid']:
            errors['to'] = toValidation['error']

        amountValidation = Conversion._validate_amount(conversionDict,   'amount', errors)
        if not amountValidation['valid']:
            errors['amount'] = amountValidation['error']

        return errors
