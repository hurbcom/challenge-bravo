/*
Package resthandler provides the following REST API endpoints:

'GET /currencies' returns a list of supported currencies.

'GET /quotes/{currency}' returns USD-based quotes for a given currency.

'GET /conversion?from={from}&to={to}&amount={amount}' converts a given amount in currency from to currency to.
*/
package resthandler
