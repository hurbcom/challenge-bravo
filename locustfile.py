from locust import HttpUser, task


class WebExchange(HttpUser):
    @task
    def index(self):
        self.client.get('/api/exchange-coin?from=eth&to=eur&amount=123.44')