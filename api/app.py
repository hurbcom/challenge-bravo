from flask import Flask
app = Flask(__name__)


@app.route('/exchange/')
def hello_world():
    return 'Hello, World!'