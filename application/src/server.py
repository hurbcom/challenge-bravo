#!/usr/bin/env python
import os
from main.app import app
from main.service.sources import Sources

import main.app
import main.routes



def defaultize():
    Sources().add_rates(Sources.standard_currencies)
    pass

if __name__ == "__main__":
    defaultize()
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090), debug=True)

