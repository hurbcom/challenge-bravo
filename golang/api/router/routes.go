// Manage routes to endpoints in api
package router

import (
	"net/http"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

// Available endpoints
var routes = Routes{
	Route{
		"Index",
		http.MethodGet,
		"/",
		NotImplemented,
	},
	Route{
		"StatusHandler",
		http.MethodGet,
		"/status",
		StatusHandler,
	},
	Route{
		"Get Exchange Rates",
		http.MethodGet,
		"/exchange-rate",
		GetExchangeRates,
	},
	Route{
		"Save Currency Code",
		http.MethodPost,
		"/currency-codes",
		SaveCurrencyCodeAndExchangeRate,
	},
	Route{
		"Delete Currency Code",
		http.MethodDelete,
		"/currency-codes/{code:[A-Z]{3,}}",
		DeleteCurrencyCodeAndExchangeRate,
	},
}
