#bin/bash
echo "subindo servidor"
python3.8 -m pip install -r requirements.txt

echo "instalando gunicorn"
python3.8 -m pip install gunicorn

echo "subindo ngnix"
/etc/init.d/nginx start

python3.8 manage.py migrate

python manage.py collectstatic

gunicorn app.wsgi:application --bind 0.0.0.0:8000

htop