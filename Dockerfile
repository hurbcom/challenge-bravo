FROM python:3.10

# Set work directory
ENV APP_HOME=/home/app
WORKDIR $APP_HOME

# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# Install dependecies
RUN pip install --upgrade pip
RUN pip install wheel
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy the whole project
COPY . .

# Update entrypoint.sh permissions
RUN sed -i 's/\r$//g' $APP_HOME/entrypoint.sh
RUN chmod +x $APP_HOME/entrypoint.sh

# Run entrypoint.sh
ENTRYPOINT ["/home/app/entrypoint.sh"]
