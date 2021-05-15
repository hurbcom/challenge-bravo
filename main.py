from flask import Flask
import os

app = Flask(__name__)


@app.route("/")
def home():
    return {"message": "working"}


if __name__ == "__main__":
    app.run(host=os.getenv('FLASK_HOT'),
            port=os.getenv('FLASK_PORT'),
            debug=True)
