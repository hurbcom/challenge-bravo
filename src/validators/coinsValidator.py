coins_validator = {
    'name': {
        'type': 'string',
        'required': True
    },
    'price': {
        'type': 'number',
        'required': True
    }
}

list_coins_validator = {
    'name': {
        'type': 'string'
    }
}

calculate_price_validator = {
    'from': {
        'type': 'string',
        'required': True
    },
    'to': {
        'type': 'string',
        'required': True
    },
    'amount': {
        'type': 'number',
        'required': True
    }
}