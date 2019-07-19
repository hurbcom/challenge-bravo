#!/usr/bin/python

import threading
import requests
import logging

class ConvMonet:
	url_usd   = 'https://api.exchangeratesapi.io/latest?base=USD'
	url_crypt = 'https://poloniex.com/public?command=returnTicker'

	rates = {}

	def __init__(self):
		self.lock = threading.Lock()
		self.refresh()

	"""
	Recarrega o valor das moedas
	"""
	def refresh(self):		
		try:
			self.lock.acquire()			
			tmp_rates = {}
			r = requests.get(self.url_usd)
			rates = r.json()['rates']
			tmp_rates['EUR'] = float(rates['EUR'])
			tmp_rates['BRL'] = float(rates['BRL'])
			tmp_rates['USD'] = float(rates['USD'])
			r = requests.get(self.url_crypt)
			rates = r.json()
			tmp_rates['BTC'] = 1 / float(rates['USDT_BTC']['last'])
			tmp_rates['ETH'] = 1 / float(rates['USDT_ETH']['last'])
			
			self.rates = tmp_rates
		finally:
			self.lock.release()
	
	"""
	Efetura a conversao monetaria
	"""
	def convert(self, p_data):
		p_rate_from = self.rates[p_data['from']]
		p_rate_to = self.rates[p_data['to']]
		p_amount = float(p_data['amount'])
		return {
			'from': p_data['from'],
			'to': p_data['to'],
			'rate_from': p_rate_from,
			'rate_to': p_rate_to,
			'amount': p_amount,
			'result': round((p_rate_to * p_amount) / p_rate_from, 5)
		}
