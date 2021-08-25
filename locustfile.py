from locust import task
from locust.contrib.fasthttp import FastHttpUser
from random import choice, randint

currencies = ['BRL', 'USD', 'EUR', 'BTC', 'ETH']


class QuickstartUser(FastHttpUser):
    @task
    def hello_world(self):
        self.client.get(
            f"/convert?to={choice(currencies)}&from={choice(currencies)}&amount={randint(1, 1028)}")
