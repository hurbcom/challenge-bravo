from server.server import *
from controllers.conversion import *
from controllers.currency import *
import os, time


if __name__ == '__main__':
    server.run(host='0.0.0.0',debug=False,threaded=True)



