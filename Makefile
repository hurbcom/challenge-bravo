include ./app/.env

DATABASE=${DB_DRIVER}://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?sslmode=disable

start-services:
	@docker compose up -d

restart-services:
	@docker compose down -d
	@docker compose up -d

restart-db:
	@docker compose down postgres --volumes
	@docker compose up postgres -d

rebuild:
	@docker compose down --volumes
	@docker compose build
	@docker compose up -d

# Migrations
create-table:
	@migrate create -ext=sql -dir=./app/internal/migration -seq $(shell echo $(filter-out $@,$(MAKECMDGOALS))_table)

create-seed:
	@migrate create -ext sql -dir ./app/internal/migration -seq $(shell echo $(filter-out $@,$(MAKECMDGOALS))_seeder)

create-view:
	@migrate create -ext sql -dir ./app/internal/migration -seq $(shell echo $(filter-out $@,$(MAKECMDGOALS))_view)

create-schema:
	@migrate create -ext sql -dir ./app/internal/migration -seq $(shell echo $(filter-out $@,$(MAKECMDGOALS))_schema)

migrations-up:
	@migrate -path ./app/internal/migration -database $(DATABASE) -verbose up

migrations-down:
	@migrate -path ./app/internal/migration -database $(DATABASE) -verbose down -all

# Tests
app-integration-test:
	@go test ./app/test/integration/...

app-integration-test-verbose:
	@go test ./app/test/integration/... -v

#  Swagger
generate-app-swagger-docs:
	@rm -rf ./app/docs
	@swag init -g ./app/cmd/app/main.go -o ./app/docs --exclude ./job

generate-job-swagger-docs:
	@rm -rf ./job/docs
	@swag init -g ./job/cmd/main.go -o ./job/docs --exclude ./app

format-swagger-configs:
	@swag fmt
