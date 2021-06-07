import logging
from flask import Flask
from waitress import serve
from views.coin_rates import set_coin_rates_external_api_to_redis, convert_two_currencies, set_fake_coin_to_redis, \
    remove_rate_from_redis
from os.path import join, dirname
from dotenv import load_dotenv

app = Flask(__name__)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dotenv_path = join(dirname(__file__), '.env')
app.add_url_rule('/health', view_func=lambda: 'ok', methods=['GET'])
app.add_url_rule('/convert', view_func=convert_two_currencies, methods=['GET'])
app.add_url_rule('/setFakeRate', view_func=set_fake_coin_to_redis, methods=['POST'])
app.add_url_rule('/rates', view_func=remove_rate_from_redis, methods=['DELETE'])
load_dotenv(dotenv_path)
set_coin_rates_external_api_to_redis()

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000, threads=20)
