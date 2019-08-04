from decimal import Decimal
from flask_restplus import reqparse


conversionRequest = reqparse.RequestParser()
conversionRequest.add_argument('from', type=str, required=True, help='Base Currency to be converted')
conversionRequest.add_argument('to', type=str, required=True, help='Target Currency to be converted')
conversionRequest.add_argument('amount', type=Decimal, required=True, help='Amount to be converted')
