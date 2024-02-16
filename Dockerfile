# Pull official latest Python Docker image
FROM python:3.12.0

# Set the working directory
WORKDIR /usr/app

# Set up Python behaviour
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV VIRTUAL_ENV=/opt/venv

# Switch on virtual environment
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gettext \
    libpq-dev \
    libcurl4-openssl-dev \
    libssl-dev

# Install Python dependencies
RUN python3 -m pip install --upgrade setuptools wheel
RUN pip install --upgrade pip

# Copy all files
COPY . .

# Set the server port
EXPOSE 8000

# Start up the backend server
CMD uvicorn app.main:app --reload
