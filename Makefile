.PHONY: menu
menu:
	@echo ""
	@echo "* Infrasctructure Options ***************************************"
	@echo "* setup \t\t Download, install and configure project dependencies"
	@echo "* start \t\t Initiate docker infrastructure"
	@echo "* stop \t\t\t Stop docker infrastructure"
	@echo ""
	@echo "* Code Quality **************************************************"
	@echo "* tests \t\t Perform unit tests"
	@echo "* phpcs \t\t Validate PSR2 complicance"
	@echo "* phpcbf \t\t Fix PSR2 violations"

#### Infrasctructure Options ################################################

.PHONY: setup
setup: start
	@echo "Downloading composer and installing project dependencies"
	@docker exec currency-converter-php /src/setup.sh

.PHONY: start
start:
	@echo "Initiating docker infrastructure... "
	@docker-compose up -d

.PHONY: stop
stop:
	@echo "Stopping docker infrastructure... "
	@docker-compose stop

#### Code Quality ###########################################################

.PHONY: tests
tests:
	@echo "Performing unit tests... "
	@docker exec currency-converter-php ./vendor/bin/phpunit

.PHONY: phpcbf
phpcbf:
	@echo "Fixing PSR2 violations... "
	@docker exec currency-converter-php ./vendor/bin/phpcbf ./ -nq --standard="PSR2" --extensions=php --ignore=*/vendor/*

.PHONY: phpcs
phpcs:
	@echo "Validating PSR2 complicance... "
	@docker exec currency-converter-php ./vendor/bin/phpcs ./ -nq --standard="PSR2" --extensions=php --ignore=*/vendor/*