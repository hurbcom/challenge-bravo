#!/bin/bash

echo "===============Install requirements=================="
pip install -r requirements.txt
echo "===========Django migrate============="
python manage.py migrate
echo "===============Start Nginx==========================="
/etc/init.d/nginx start
/etc/init.d/nginx status
echo "===============Start application=================="
gunicorn --access-logformat '%(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s \"%(f)s\" \"%(a)s\" request_id=%({X-REQUEST-ID}i)s' --access-logfile - --bind 0.0.0.0:8000 --max-requests 1200 -w 5 -t 600 core.wsgi:application