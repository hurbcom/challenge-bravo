from locust import (
    HttpUser,
    task,
)


class TestLocust(HttpUser):
    """
    a classe de teste de carga
    """

    @task(1)
    def euro_to_dolar(self):
        """
        testando endpoint
        """
        endpoint = "api/v1/currency?from=USD&to=BRL&amount=100"
        self.client.get(endpoint)

    @task(1)
    def dolar_to_euro(self):
        """
        testando endpoint
        """
        endpoint = "api/v1/currency?from=USD&to=EUR&amount=100"
        self.client.get(endpoint)

    @task(1)
    def real_to_euro(self):
        """
        testando endpoint
        """
        endpoint = "api/v1/currency?from=BRL&to=EUR&amount=100"
        self.client.get(endpoint)

    @task(2)
    def get_all_user(self):
        """
        testando endpoint
        """
        endpoint = "api/v1/currency/get-all-currency"
        self.client.get(endpoint)
