import redis
from flask import Flask, request, jsonify
from flask_cache import Cache

pool = redis.ConnectionPool(host='redis', port=6379, db=0)
rd = redis.Redis(connection_pool=pool)
app = Flask(__name__)

cache = Cache()
CACHE_TYPE = 'simple'

@app.route("/converter/")
def api():
    fr= str(request.args.get('from')).upper()
    to = str(request.args.get('to')).upper()
    amount = float(request.args.get('amount'))
    try:
        # GET rate convertion on redis and multiply per amount
        rate = rd.get('%s%s' % (fr, to))
        if (rate is not None):
            rate = float(rate)
            converted = float(rate) * amount
        else:
            # IF rate not found on redis, try convertion reverse by rate reverse
            rate_reverse = rd.get('%s%s' % (to, fr))
            if (rate_reverse is not None):
                rate = float(1 / float(rate_reverse))
                converted = amount * rate
                rd.setex('%s%s'%(to, fr), rate, 1800)
            else:
                api.abort(404, "Base currency %s not found" % (to.upper()))
        return jsonify(
            {
                'from': fr,
                'to': to,
                'rate': rate,
                'amount': amount,
                'converted_amount': converted
            }
        ), 200

    except Exception as e:
        print(dict(error_message=str(e)))

if __name__ == "__main__":
    cache.init_app(app)
    app.run()