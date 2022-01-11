from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    @task(1)
    def index(self):
        self.client.get("http://172.18.0.2:5000/currency?name=USD")