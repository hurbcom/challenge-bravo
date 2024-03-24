# Pull official latest Python Docker image
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONOPTIMIZE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies with poetry
RUN apt-get update && apt-get install -y \
    build-essential \
    gettext \
    libpq-dev \
    libcurl4-openssl-dev \
    libssl-dev

# Copy all files
COPY . .

# Install Python dependencies
RUN python3 -m pip install --upgrade setuptools wheel
RUN pip install --upgrade pip
RUN pip install -r requirements-dev.txt

# Set the server port
EXPOSE 8000

################### INIT CRON JOB
# Give execution rights on the cron scripts
RUN chmod 0644 init_currencys_in_db.py

#Install Cron
RUN apt-get update
RUN apt-get -y install cron

# Add the cron job
RUN crontab -l | { cat; echo "0 0 * * * python /home/$USER/init_currencys_in_db.py"; } | crontab -

# # Run the command on container startup
# CMD cron

# 
RUN echo "CRONJOB FINALIZADO!"
################### FINISH CRON JOB

# Start up the backend server
CMD uvicorn app.main:app --reload
