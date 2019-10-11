from locust import TaskSet, task, HttpLocust

class ConverterTasks(TaskSet):
    @task
    def day_to_hour(self):
        self.client.get('/dh/5')

    @task
    def day_to_minute(self):
        self.client.get('/dm/2')


class ApiUser(HttpLocust):
    task_set = ConverterTasks
    min_wait = 1000
    max_wait = 3000