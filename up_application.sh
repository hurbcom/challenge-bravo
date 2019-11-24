docker rm -f hurb-challenge
docker rmi -f hurb-image:1.0
docker build -t hurb-image:1.0 .
docker run -d -p 5000:5000 --name hurb-challenge hurb-image:1.0
docker ps
# docker exec -it hurb-challenge bash
