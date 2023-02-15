from locust import HttpUser, between, task

currency_codes = [
    "usd",
    "brl",
    "eur",
    "btc",
    "eth",
]


class CurrencyEndpoints(HttpUser):
    wait_time = between(0, 1)

    @task
    def get_all_currencies_prices(self):
        self.client.get("/currency")
