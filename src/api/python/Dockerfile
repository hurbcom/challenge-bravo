FROM python
ADD . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["/usr/local/bin/gunicorn", "-w", "8", "-b", ":8888", "run:app"]