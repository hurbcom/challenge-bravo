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

/* Available endpoints */
var routes = Routes{
	Route{
		"Index",
		"GET",
		"/",
		NotImplemented,
	},
	Route{
		"StatusHandler",
		"GET",
		"/status",
		StatusHandler,
	},
	Route{
		"Get Exchange Rates",
		"GET",
		"/exchange-rate",
		getExchangeRates,
	},
	Route{
		"Save Currency Code",
		"POST",
		"/currency-codes",
		saveCurrencyCodeAndExchangeRate,
	},
	Route{
		"Delete Currency Code",
		"DELETE",
		"/currency-codes/{code}",
		deleteCurrencyCodeAndExchangeRate,
	},
}
