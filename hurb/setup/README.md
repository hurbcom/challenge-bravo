## This tutorial has the needed steps to configure the Mongo DB server required to run this code challenge.

#### This tutorial assumes docker is already installed and can be used normally. If facing any issue, try following this [Post Installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/)

1. Pull [tutum/mongodb](https://hub.docker.com/r/tutum/mongodb) container: `docker pull tutum/mongodb`
1. Run the container: `docker run --name hurb-challenge -d -p 27017:27017 -p 28017:28017 -e MONGODB_PASS="randomhze3185JFK" tutum/mongodb`
1. Verify if _hurb-challenge_ container is  running: `docker ps -a |grep hurb-challenge |wc -l`
    - output must be `1`
1. I wrote a shell script with these steps. Just run `sh mongo.sh` in the terminal.