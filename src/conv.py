#!/usr/bin/python

from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
from api import *
from job import *
import logging
import json

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s | %(levelname)-12s | %(threadName)-12s | %(message)s',)

conv = ConvMonet()

def update_rates():
	conv.refresh()

@view_config(renderer='json')
def api_request(request):
	valid_currencies = ['EUR', 'BRL', 'USD', 'BTC', 'ETH']
	params = ['from', 'to', 'amount']
	data = {}
	err = None
	
	try:
		for k in params:
			data[k] = request.params[k]
			if k in ['from', 'to'] and request.params[k] not in valid_currencies:
				err = {'Error': "Moeda invalida no param '%s'" % k}
				break			
	except KeyError:
		err = {'Error': "Param '%s' nao enviado" % k}
		
	if not err is None:
		request.response.status = 400
		logging.error(err)
		return err

	ret = conv.convert(data)
	logging.info(ret)
	return ret

if __name__ == '__main__':
	signal.signal(signal.SIGTERM, signal_handler)
	signal.signal(signal.SIGINT, signal_handler)

	"""
	Job para atualizacao do valor das moedas
	"""
	job = Job(interval=timedelta(seconds=WAIT_TIME_SECONDS), execute=update_rates)
	job.start()

	try:
		with Configurator() as config:
			config.add_route('api', '/api')
			config.add_view(api_request, route_name='api', renderer='json')
			app = config.make_wsgi_app()
		server = make_server('0.0.0.0', 6543, app)
		server.serve_forever()
	except SigKill:
		job.stop()
		logging.debug('Exiting...')
		sys.exit(0)
