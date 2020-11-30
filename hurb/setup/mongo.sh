#bin/bash
echo "ALERT: this script does not verify if docker is available to the user"
# if docker is installed
if [ -z "$(command -v docker)" ]; then
    echo "aborting mongo install"
    echo "docker must be installed"
    exit 1
fi

# if there already is a hurb-challenge container running
if [ $(docker ps -a |grep hurb-challenge |wc -l) -ne "0" ]; then
    echo "skipping mongodb setup"
    echo "there is already a 'hurb-challenge' container running"
    exit 1
fi

# pulls the docker image
if [ $(docker images |grep tutum/mongodb |wc -l) -eq "0" ]; then
    echo "pulling tutum/mongodb"
    docker pull tutum/mongodb # pulls tutum's mongodb docker container
fi

# sets up the container
if [ $(docker ps -a |grep hurb-challenge |wc -l) -eq "0" ]; then
    echo "setting hurb-challenge container"
    docker run -d --name hurb-challenge -d -p 27017:27017 -p 28017:28017 -e MONGODB_PASS="randomhze3185JFK" tutum/mongodb
else
    echo ""
fi
