from flask import Flask
app = Flask(__name__)
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

if __name__ == '__main__':
    app.run(port=8000)
