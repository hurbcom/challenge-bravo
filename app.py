from challenge_bravo.config import app
import challenge_bravo.currency_exchange.views

import os
from challenge_bravo.config import DEBUG

HOST = os.getenv("IP_ADDRESS") or "0.0.0.0"
PORT = 8080

if __name__ == '__main__':
    import logging
    if DEBUG:

        logging.basicConfig(filename='debug.log', level=logging.DEBUG)
        logging.basicConfig(filename='warning.log', level=logging.WARNING)
        app.run(host=HOST, port=PORT, debug=True, threaded=True) # processes=3

    logging.basicConfig(filename='info.log', level=logging.INFO)
    app.run(host=HOST, port=PORT, debug=False)