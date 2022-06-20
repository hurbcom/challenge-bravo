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

# Run the Redis Commander
run_commander:
	@echo "Running commander"
	docker-compose up --build -d redis-commander
	@echo "Running commander done"

# Run tests
tests:
	@echo "Running tests"
	 go test ./...
	@echo "Running tests done"

# Insert the USD on database to be used by the API
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

