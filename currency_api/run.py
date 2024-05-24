import threading
import time
import requests
from app import create_app, db
from app.models import Currency

# Função para atualizar as taxas de câmbio
def update_exchange_rates():
    app = create_app()
    with app.app_context():
        # Verifica se a moeda "HURB" existe no banco de dados e adiciona-a se necessário
        hurb_currency = Currency.query.filter_by(code='HURB').first()
        if not hurb_currency:
            hurb_currency = Currency(code='HURB', name='HURB', rate_to_usd=15.0)
            db.session.add(hurb_currency)
            db.session.commit()
            print("Moeda fictícia HURB adicionada com sucesso.")
        else:
            print("Moeda fictícia HURB já existe no banco de dados.")

        #Loop para atualizar os valores
        while True:
            try:
                # Obter os preços do Bitcoin (BTC) e Ethereum (ETH) da API CoinGecko
                response = requests.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
                if response.status_code == 200:
                    data = response.json()
                    btc_price = data.get('bitcoin', {}).get('usd')
                    eth_price = data.get('ethereum', {}).get('usd')

                    # Adicionar ou atualizar os preços do BTC e ETH no banco de dados
                    btc_currency = Currency.query.filter_by(code='BTC').first()
                    if btc_currency:
                        btc_currency.rate_to_usd = btc_price
                    else:
                        new_btc_currency = Currency(code='BTC', name='Bitcoin', rate_to_usd=btc_price)
                        db.session.add(new_btc_currency)

                    eth_currency = Currency.query.filter_by(code='ETH').first()
                    if eth_currency:
                        eth_currency.rate_to_usd = eth_price
                    else:
                        new_eth_currency = Currency(code='ETH', name='Ethereum', rate_to_usd=eth_price)
                        db.session.add(new_eth_currency)

                    # Obter as taxas de câmbio da API v6.exchangerate-api.com
                    api_key = '1680c81c8217ed00e6d66163'
                    response = requests.get(f'https://v6.exchangerate-api.com/v6/{api_key}/latest/USD')
                    if response.status_code == 200:
                        data = response.json()
                        rates = data.get('conversion_rates', {})
                        currencies_to_update = ['USD', 'BRL', 'EUR']
                        for currency_code in currencies_to_update:
                            rate = rates.get(currency_code)
                            if rate is not None:
                                currency = Currency.query.filter_by(code=currency_code).first()
                                if currency:
                                    currency.rate_to_usd = rate
                                else:
                                    # Se a moeda não existir no banco de dados, vamos adicioná-la
                                    new_currency = Currency(code=currency_code, name=currency_code, rate_to_usd=rate)
                                    db.session.add(new_currency)
                        db.session.commit()
                        print("Valores atualizados com sucesso.")
                    else:
                        print("Falha ao buscar taxas de câmbio.")
                else:
                    print("Falha ao buscar preços do Bitcoin e Ethereum.")
            except Exception as e:
                print(f"Erro ao atualizar Valores: {e}")
            time.sleep(10)  # Espera 10 segundos antes de atualizar novamente

# Iniciar a função de atualização em uma thread em segundo plano
update_thread = threading.Thread(target=update_exchange_rates)
update_thread.daemon = True
update_thread.start()

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000)