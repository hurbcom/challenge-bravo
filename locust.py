from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    @task(1)
    def index(self):
        self.client.get("http://127.0.0.1:5000/currency?name=USD")