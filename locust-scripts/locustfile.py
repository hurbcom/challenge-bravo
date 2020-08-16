from locust import task, between
from locust.contrib.fasthttp import FastHttpUser

import random


class WebUser(FastHttpUser):
    wait_time = between(2, 5)

    @task(1)
    def quote_by_currency_brl_eur(self):

        symbols = ["USD", "BRL", "BTC", "ETH", "EUR"]

        symbol = symbols[random.randint(0, 4)]
        symbol_to = symbols[random.randint(0, 4)]
        amount = random.randrange(random.randint(1, 5))

        self.client.get(
            f'/currency?from={symbol}&to={symbol_to}&amount={amount}')
