#bin/bash
echo "subindo servidor"
python3.9 -m pip install -r requirements.txt
python3.9 -m pip install gunicorn

echo "subindo ngnix"
/etc/init.d/nginx start

python3.9 manage.py migrate

python3.9 manage.py runserver 0.0.0.0:8000