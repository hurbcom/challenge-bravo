from main.model.exchange import ExchangeSource as ExchangeSourceModel
from main.model.exchange import ExchangeRate as ExchangeRateModel
from main.repository.exchange import ExchangeSource as ExchangeSourceRespository
from main.repository.exchange import ExchangeRate as ExchangeRateRespository
from main.repository.currency import Currency as CurrencyRepository
from main.app import logger
import aiohttp
import asyncio
import json
import requests

loop = asyncio.get_event_loop()

class Exchangerate():

    source_name = 'exchangerate'
    source_uri = 'https://api.exchangerate-api.com/v4/latest/USD'

    def get_request(self,source_uri):
        try:
            res = requests.get(source_uri)
            return {'html': res.text, 'status': res.status_code, 'url': res.url, 'original_url': source_uri}
        except requests.RequestException:
            return

    def add_default_allowe_currencies(self, currencies):
        for i in currencies:
            try:
                CurrencyRepository.create({"name": i,"currency": i})
            except Exception:
                logger.error('Error on storing allowed currency')

    def dump_rates_to_local_database(self):

        self.add_default_allowe_currencies(currencies=['USD', 'BRL', 'EUR', 'BTC', 'ETH'])

        data1 = self.get_request(self.source_uri)
        payload = json.loads(data1['html'])

        if(payload):
            exchange_rate_respository = ExchangeRateRespository()
            exchange_rate_model = ExchangeRateModel()

            query = {
                "source":self.source_name,"base":payload.get('base'),"date":payload.get('date'),
                "time_last_updated":payload.get('time_last_updated'),
            }

            object = ExchangeSourceRespository().find({'base':'USD'})

            if object.count(True):
                object = ExchangeSourceRespository().hydrate_rates(object[0])
                return object

            object = ExchangeSourceRespository()\
                .create(data=ExchangeSourceModel().load(query))

            if '_id' in object:
                rates = payload.get('rates')
                if rates:
                    rates_loaded = {}
                    for i in rates:
                        rate_loaded = exchange_rate_respository.create(data=exchange_rate_model.load({
                            "currency": i, "value": rates[i], "source_id": object['_id']
                        }))

                        if rate_loaded:
                            rates_loaded[rate_loaded['currency']] = rate_loaded['value']

                    object['rates'] = rates_loaded

                self.add_default_allowe_currencies(currencies=['USD','BRL','EUR','BTC','ETH'])

                return object
            else:
                raise Exception('Unknow error trying to get source exchange rates')
        else:
            raise Exception('Error trying to get source exchange rates')
