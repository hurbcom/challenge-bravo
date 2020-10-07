#!/usr/bin/env python
import os
from main.app import app
# from main.app import app

import main.app
import main.routes

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090), debug=True)

