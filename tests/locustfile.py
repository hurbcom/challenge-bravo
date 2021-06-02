import random

from locust import HttpUser
from locust import between
from locust import task


class CoinConverterUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def convert_coin(self):
        coins = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

        self.client.get(
            f'/api/v1/coins/convert?code_from={random.choice(coins)}&'
            f'code_to={random.choice(coins)}&amount={random.randint(1, 100)}')
