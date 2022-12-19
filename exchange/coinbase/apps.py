from django.apps import AppConfig


class CoinbaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'exchange.coinbase'

    def ready(self):
        from exchange.coinbase.schedulers import start_job_coinbase_updater

        # Runs the job responsible for update the currency rate dinamic and automatically.
        start_job_coinbase_updater()
        return super().ready()
