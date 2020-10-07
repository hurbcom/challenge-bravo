#!/usr/bin/env python
from main.app import api
from main.controller.healthcheck import Healthcheck
from main.controller.currencies import Currencies
from main.controller.exchanges import Exchanges

api.add_resource(Healthcheck, '/')
api.add_resource(Currencies, '/currencies')
api.add_resource(Currencies, '/currencies/<string:currency>', endpoint = 'currency_delete')
api.add_resource(Exchanges, '/exchanges', endpoint = 'exchange_get')
