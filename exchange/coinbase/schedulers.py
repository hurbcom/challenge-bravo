from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings

from exchange.coinbase.views import CoinbaseAPIView


def start_job_coinbase_updater():
    """
    Instantiate a BackgrounScheduler to run CoinbaseAPIView.coinbase_updater method
    on SCHEDULER_TIMEOUT_IN_MINUTES interval (default 2 minutes).
    """

    scheduler = BackgroundScheduler()
    coinbase = CoinbaseAPIView()

    scheduler.add_job(
        coinbase.coinbase_updater,
        'interval',
        minutes=settings.SCHEDULER_TIMEOUT_IN_MINUTES,
        id='job_coinbase_updater_001',
        replace_existing=True)

    scheduler.start()
