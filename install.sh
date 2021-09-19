sudo docker run -p 6379:6379 -d redis:buster --requirepass "1EnsvG7x0/Q1l4/MQGmihU28KZDMUa1nwkGqdHQ0aJGvKBimEKn8XELp9mkH5niKPOQIlCEfSm1L9mw8"
sudo docker build -f Dockerfile_base_image -t base_image .
sudo docker build -t conversor_de_moedas .