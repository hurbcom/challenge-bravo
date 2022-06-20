# Run the mongo database
run_database:
	@echo "Running database"
	docker-compose up --build -d mongodb
	@echo "Running database done"

# Run the Redis server
run_cache:
	@echo "Running cache"
	docker-compose up --build -d redis
	@echo "Running cache done"

# Run the API
run_api:
	@echo "Running api"
	docker-compose up --build api
	@echo "Running api done"

insert_migration:
	@echo "Inserting default migration"
	docker-compose up --build -d mongo-seed
	@echo "Inserting default migration done"
# Run all the services
run:
	@make run_database
	@make insert_migration
	@make run_cache
	@make run_api

