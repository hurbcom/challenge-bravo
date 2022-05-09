import time
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    @task
    def get(self):
        self.client.get("/currency?code=BRL")
        self.client.get("/currency?code=USD")
        self.client.get("/currency?code=ETH")
        self.client.get("/currency?code=EUR")
        self.client.get("/currency?code=BTC")
