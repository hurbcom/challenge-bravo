from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = 'core'

    def ready(self):
        from . import updater
        updater.update_currencies()  # update currencies first time
        updater.start()  # set the job to update currencies every hour
