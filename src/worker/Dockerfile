FROM python
ADD . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["/usr/local/bin/python", "run.py"]