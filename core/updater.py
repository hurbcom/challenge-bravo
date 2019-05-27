
def update_currencies():
    import requests
    import json
    from core.models import Currency
    from currencies.settings import (
        CURRENCY_APP_ID,
        CURRENCY_SHOW_ALTERNATIVE,
        CURRENCY_URL,
    )

    kwargs = {
        'base': Currency.objects.filter(is_base=True).values_list(
            'symbol',
            flat=True,
        ).get(),
        'app_id': CURRENCY_APP_ID,
        'show_alternative': CURRENCY_SHOW_ALTERNATIVE,
    }
    response = requests.get(CURRENCY_URL, params=kwargs)
    response.raise_for_status()
    data = json.loads(response.content)
    rates = data['rates']

    for currency in Currency.objects.filter(is_base=False).iterator():
        based_value = rates.get(currency.symbol)
        if based_value:
            currency_value = 1/based_value
        else:
            currency_value = 0
        currency.value = currency_value
        currency.save()


def start():
    from apscheduler.schedulers.background import BackgroundScheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_currencies, trigger='cron', minute='5')
    scheduler.start()
