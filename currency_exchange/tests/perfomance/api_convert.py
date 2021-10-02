from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)

    # @task
    # def convert_currency(self):
    #     self.client.get("/convert?from=BRL&to=EUR&amount=1")

    @task
    def testing_without_db(self):
        self.client.get("/testing")
