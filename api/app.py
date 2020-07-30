from flask import Flask, Response
app = Flask(__name__)


@app.route('/exchange/')
def hello_world():
    return Response({}, status=200, mimetype='application/json')