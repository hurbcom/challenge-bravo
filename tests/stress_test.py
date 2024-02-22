from locust import HttpUser, between, task

class MyUser(HttpUser):
    wait_time = between(0.1, 0.5)
    host = "http://localhost:8000"

    @task
    def my_task(self):
        self.client.get("/convert?from_currency=USD&to_currency=BRL&amount=2") 