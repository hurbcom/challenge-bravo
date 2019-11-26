docker rm -f hurb-challenge
docker rmi -f hurb-image:1.0
docker build -t hurb-image:1.0 .
docker run -d -p 5001:5000 --name hurb-challenge hurb-image:1.0
docker image ls -a
docker ps -a
sleep 1
curl -X GET http://localhost:5001/healthcheck
