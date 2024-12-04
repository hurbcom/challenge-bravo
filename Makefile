
.PHONY: run-api, create-api, shutdown, test test-external-provider test-application

run-api:
	docker compose up -d database-currency && sleep 4 && docker compose up -d currency-api

create-api:
	docker compose build --no-cache --pull

shutdown:
	docker compose down --rmi all

sync-data:
	docker exec -it currency-api /bin/sh -c './challenge-bravo -sync'

prepare: create-api run-api sync-data 

seek-and-destroy:
	docker docker rm -v -f currency-api && docker rm -v -f database-currency

# Regra para rodar todos os testes
test: test-external-provider test-application

# Regra para rodar os testes no pacote external
test-external-provider:
	go test -count=1 ./pkg/external/... -v

# Regra para rodar os testes no pacote application
test-application:
	go test -count=1 ./application/... -v