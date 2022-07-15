package abstract

import "strings"

const (
	// EndpointLive is the base endpoint to make requests to the live endpoint.
	EndpointLive = "/live"
)

var (
	// EndpointGetLive is a helper func used to build all the query params necessary
	// to make a request to the EndpointLive API.
	//
	// base:		the base currency.
	// targets:		targeted currencies. It is optional and can be nil.
	// apiKey:		the API Key to grant access to the Abstract API
	EndpointGetLive = func(base string, targets []string, apiKey string) string {
		uri := EndpointLive + "?api_key=" + apiKey + "&base=" + base

		if len(targets) > 0 {
			uri += "&target=" + strings.Join(targets, ",")
		}

		return uri
	}
)
