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
        ''' Returns whether the currency is valid and supported

        Keyword arguments:
            dict_ -- Dictionary containing string currencies conversionDict['from'], conversionDict['to'] and a decimal amount @conversionDict['amount']
            field -- field containing the desired key to validate
            validCurrencies -- List of strings containing the supported currencies
            isRequired -- flag indicating if @field can be empty in @dict (default: False)
        
        Returned value:
            A dict containing the following fields:
                - valid (Boolean)
                - error (str) containing the errored field
        '''
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
        ''' Returns whether the amount specified is valid

        Keyword arguments:
            dict_ -- Dictionary containing string currencies conversionDict['from'], conversionDict['to'] and a decimal amount @conversionDict['amount']
            field -- field containing the desired key to validate
            isRequired -- flag indicating if @field can be empty in @dict (default: False)
        
        Returned value:
            A dict containing the following fields:
                - valid (Boolean)
                - error (str) containing the errored field
        '''
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
            validation['error'] = '{field} ({value}) is an invalid positive decimal. Use ''.'' for decimal separator'.format(field=field, value=dict_[field])
            return validation

        if not isinstance(value, Decimal) or value < 0:
            validation['valid'] = False
            validation['error'] = '{field} ({value}) must be a positive decimal'.format(field=field, value=value)
        return validation
    
    @staticmethod
    def is_valid(conversionDict, validCurrencies):
        ''' Returns whether the conversion specified is valid

        Keyword arguments:
            conversionDict -- Dictionary containing string currencies 
                conversionDict['from'], conversionDict['to']
                and a decimal amount @conversionDict['amount']
            validCurrencies -- List containing string currencies

        Returned value:
            A dict with each errored field as key and a value containing the reason
            If every field is OK, then an empty dict is returned
        '''
        errors = {}

        fromValidation = Conversion._validate_currency(conversionDict, 'from', validCurrencies, isRequired=True)
        if not fromValidation['valid']:
            errors['from'] = fromValidation['error']

        toValidation = Conversion._validate_currency(conversionDict, 'to',   validCurrencies, isRequired=True)
        if not toValidation['valid']:
            errors['to'] = toValidation['error']

        amountValidation = Conversion._validate_amount(conversionDict,   'amount', isRequired=True)
        if not amountValidation['valid']:
            errors['amount'] = amountValidation['error']

        return errors
