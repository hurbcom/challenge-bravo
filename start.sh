python exchange_app/manage.py makemigrations --verbosity 0 &
python exchange_app/manage.py migrate  --verbosity 0 &
python exchange_app/manage.py loaddata exchange_app/data.json  --verbosity 0 &
python exchange_app/manage.py runserver
