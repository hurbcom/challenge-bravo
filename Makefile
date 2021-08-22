api:
	sanic src.api.app --port=8033
docker-dbu:
	docker-compose down && docker-compose build && docker-compose up
