from locust import (
    HttpUser,
    task,
)


class TestLocust(HttpUser):
    """
    a classe de teste de carga
    """

    @task
    def get_user(self):
        """
        testando endpoint
        """
        endpoint = "api/v1/currency/get-all-currency"
        self.client.get(endpoint)
