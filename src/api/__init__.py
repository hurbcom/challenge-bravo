from common import app
from exception import BravoException, GEE006

from .currency import CurrencyApi


@app.errorhandler(404)
def handler_404(_):
    return BravoException(GEE006, http_status=404).http_response
