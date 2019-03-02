from flask import Flask, request
import urllib, json, datetime
import sqlite3
from sqlite3 import Error

app = Flask(__name__)

@app.route("/currency")
def index():
    from_currency = request.args.get("from")
    to_currency = request.args.get("to")
    amount = request.args.get("amount")
    flag = check_entries(from_currency, to_currency, amount)
    if flag == "OK":
        return currencyConverter(from_currency, to_currency, float(amount))
    else:
        return flag, 400

def get_exchange_rate(from_currency, to_currency):
    conn = create_connection()
    id_ = "%s_%s" % (from_currency, to_currency)
    if conn != None and table_exists(conn):
        exchange_rate = get_exchange_rate_from_database(conn, id_)
        must_update = must_update_exchange_rate(conn, id_)
        must_insert = (exchange_rate == None)
        must_consult_web = must_update or must_insert
        if must_consult_web:
            exchange_rate, timestamp = get_exchange_rate_from_web(from_currency, to_currency)
            if must_update:
                update_exchange_rate(conn, id_, exchange_rate, timestamp)
            if must_insert:
                insert_exchange_rate(conn, id_, exchange_rate, timestamp)
    else:
        if conn != None:
            create_table(conn)
            exchange_rate, timestamp = get_exchange_rate_from_web(from_currency, to_currency)
            insert_exchange_rate(conn, id_, exchange_rate, timestamp)
        else:
            exchange_rate = None
    return exchange_rate

def currencyConverter(from_currency, to_currency, amount):
    exchange_rate = get_exchange_rate(from_currency, to_currency)
    if exchange_rate != None:
        converted_amount = amount * exchange_rate
        return '{ "from": "%s", "to": "%s", "amount": %.2f, "converted_amount": %.2f, "exchange_rate": %f }' % (from_currency, to_currency, amount, converted_amount, exchange_rate), 200
    return "An unexpected error occurred", 500


def check_entries(from_currency, to_currency, amount):
    accepted_currencies = {"USD", "BRL", "EUR", "BTC", "ETH"}
    status = "OK"
    if from_currency == None or to_currency == None or amount == None:
        status = "ERROR: The url must follow the pattern '/currency?from=FROM_CURRENCY&to=TO_CURRENCY&amount=AMOUNT' where FROM_CURRENCY and TO_CURRENCY must be in this list {USD, BRL, EUR, BTC, ETH} and AMOUNT must be a positive number"
    elif from_currency not in accepted_currencies or to_currency not in accepted_currencies:
        status = "ERROR: We only support the following currencies: USD, BRL, EUR, BTC and ETH."
    elif is_number(amount):
        number = float(amount)
        if number < 0:
            status = "ERROR: The amount must be positive."
    else:
        status = "ERROR: The amount must be a number."
    return status

def must_update_exchange_rate(conn, id_):
    timestamp = get_timestamp_from_database(conn, id_)
    if timestamp != None:
        previous_datetime = datetime.datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
        current_datetime = datetime.datetime.now()
        time_delta = current_datetime - previous_datetime
        if time_delta.seconds > 3600:
            return True
    return False

def create_connection():
    try:
        conn = sqlite3.connect("exchange_rates.db")
        return conn
    except Error as e:
        print(e)
    return None

def create_table(conn):
    sql_create_exchange_rates_table = """CREATE TABLE IF NOT EXISTS exchange_rates (
                                    id text PRIMARY KEY,
                                    exchange_rate real NOT NULL,
                                    timestamp text NOT NULL
                                );"""
    try:
        cursor = conn.cursor()
        cursor.execute(sql_create_exchange_rates_table)
    except Error as e:
        print(e)

def insert_exchange_rate(conn, id_, exchange_rate, timestamp):
    sql = ''' INSERT INTO exchange_rates(id, exchange_rate,timestamp)
              VALUES(?,?,?) '''
    cursor = conn.cursor()
    cursor.execute(sql,(id_, exchange_rate, timestamp))
    conn.commit()

def update_exchange_rate(conn, id_, exchange_rate, timestamp):
    sql = ''' UPDATE exchange_rates
              SET exchange_rate = ?,
              timestamp = ?
              WHERE id = ?'''
    cursor = conn.cursor()
    cursor.execute(sql,(exchange_rate, timestamp, id_))
    conn.commit()

def get_exchange_rate_from_database(conn, id_):
    sql = "SELECT exchange_rate FROM exchange_rates WHERE id=?"
    cursor = conn.cursor()
    cursor.execute(sql, (id_,))
    data = cursor.fetchall()
    if len(data) > 0:
        return data[0][0]
    return None

def get_exchange_rate_from_web(from_currency, to_currency):
    if from_currency == to_currency:
        exchange_rate = 1
    else:
        url = "https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=%s" % (from_currency, to_currency)
        response = urllib.urlopen(url)
        data = json.loads(response.read())
        exchange_rate = data["%s" % to_currency]
    timestamp = str(datetime.datetime.now()).split('.')[0]
    return exchange_rate, timestamp

def get_timestamp_from_database(conn, id_):
    sql = "SELECT timestamp FROM exchange_rates WHERE id=?"
    cursor = conn.cursor()
    cursor.execute(sql, (id_,))
    data = cursor.fetchall()
    if len(data) > 0:
        return data[0][0]
    return None

def table_exists(conn):
    sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='exchange_rates'"
    cursor = conn.cursor()
    cursor.execute(sql)
    data = cursor.fetchall()
    if len(data) > 0:
        return True
    return False

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

if __name__ == '__main__':
    app.run(debug=True)