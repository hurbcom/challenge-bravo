# Currency Converter

This API provides currency conversion feature.
The USD is the base rate to execute the conversion among other currencies using a real external service.

The following currencies are available:
 - USD
 - BRL
 - EUR
 - BTC
 - ETH

Request Example (all fields are mandatory):
 - http://localhost?from=BTC&to=EUR&amount=123.45

## Setup Instructions

  - Based on the assumption you have Docker available, at the project root folder, type: make setup. At this point, docker infrastructure will be started and project and infrastructure dependencies will be configured.
  - Once setup is complete, future usage requires just "make start" and "make stop" commands.

## Technical overview
- This project is compliant with PSR-2. It can be validated from the root folder through the following command: make phpcs.
- Tests use PHPUnit. They can be executed from the root folder through the following command: make tests.
- Lumen Framework was used as the API framework
	- The 'artisan' file and 'public' folder are practically the templates itself. All other files generated under the api folder were properly changed due to the project needs.

