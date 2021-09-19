FROM base_image:latest

COPY . ./
RUN pip install -r requirements.txt
RUN chmod +x ./bash.sh
EXPOSE 8000

CMD ./bash.sh