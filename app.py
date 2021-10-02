# -*- coding: utf-8 -*-
"""
Created on Sat Aug 02 01:18:51 2021
@author: Wilson Ricardo Pereira Silveira
"""

from config import app
import currency_exchange.views

import os
from config import DEBUG

HOST = os.getenv("IP_ADDRESS") or "0.0.0.0"
PORT = 8080

if __name__ == '__main__':
    import logging
    if DEBUG:

        logging.basicConfig(filename='debug.log', level=logging.DEBUG)
        logging.basicConfig(filename='warning.log', level=logging.WARNING)
        app.run(host=HOST, port=PORT, debug=True, threaded=True, use_reloader=False)

    logging.basicConfig(filename='info.log', level=logging.INFO)
    app.run(host=HOST, port=PORT, debug=False, threaded=True, use_reloader=False)