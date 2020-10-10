#/bin/bash

run:
	@echo "Iniciando a execução do projeto..."
	docker-compose up -d &
build:
	@echo "Iniciando a construção do projeto..."
	@docker-compose up --build --remove-orphans &
stop:
	@echo "Parando o serviço..."
	docker-compose down
healthcheck:
	@echo "Iniciando a checagem do serviço"
	@curl localhost/healthcheck
stresstest-build:
	@echo "Carregando a ferramenta de análise..."
	@docker pull loadimpact/k6
stresstest-run:
	@echo "Executando análise..."
	@docker run --net="host" -i loadimpact/k6 run - <test/stress/k6script.js
stresstest-run-linux:
	@echo "Executando análise..."
	@docker run -i loadimpact/k6 --add-host=host.docker.internal:host-gateway run - <test/stress/k6script.js
unittest:
	@echo "Carregando a ferramenta de análise..."
	@docker exec -it challenge-bravo_backend_1 python -m unittest -v test.general test.sources


