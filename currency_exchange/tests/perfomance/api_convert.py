from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)

    @task
    def convert_currency(self):
        self.client.get("/convert?from=USD&to=EUR&amount=1")
