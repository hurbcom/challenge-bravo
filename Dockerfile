FROM python:3

# sets the working directory
WORKDIR /app

# copy these two field from <src> to <dest>
# <src> = current directory on host macine
# <dest> = filesystem of the container
COPY Pipfile Pipfile.lock ./

# install pipenv on the container
RUN pip install -U pipenv

# install project dependencies
RUN pipenv install --system

# copy all files and directories from <src> to <dest>
COPY . .

# expose the port
EXPOSE 8000
