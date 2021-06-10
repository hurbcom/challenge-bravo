class Container:
    def __init__(self):
        self.services = {}

    def add(self, service_name, instance):
        self.services[service_name] = instance

    def get(self, service_name):
        return self.services.get(service_name)
