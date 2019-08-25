challenge-bravo
===============

Name
----

`challenge-bravo` is a REST service which provides USD-based currency quotes and currency conversion.

Synopsis
--------

	docker build -t challenge-bravo . && docker run --publish <port>:8080 challenge-bravo
	
Description
-----------

`challenge-bravo` provides the following REST API endpoints:

- `GET /currencies`: returns a list of supported currencies.
- `GET /quotes/{currency}`: returns USD-based quotes for a given `currency`.
- `GET /conversion?from={from}&to={to}&amount={amount}`: converts a given `amount` in currency `from` to currency `to`.

Todo
----

- User-provided TCP endpoint (currently hardcoded to `:8080`)
- User-provided cache timeout (currently 15 minutes)
- Look for a better third-party quotes service; response times are **terrible**
- Automated tests for the quotes cache
- Automated tests for the REST endpoints
- Assess the usage of different containters to different endpoints

See also
--------

Go source documentation.

Author
------

Tadeu Bastos `<tadeu AT ondulat DOT net>`
