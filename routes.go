package main

import (
	"net/http"
)

type Routes struct {
}

type HandlerFunc func(http.ResponseWriter, *http.Request)

func (routes *Routes) RegisterAll() {
	routes.register("/conversions", Get, http.MethodGet)
}

func (routes *Routes) register(route string, handler HandlerFunc, method string) {
	http.HandleFunc(route, routes.setup(handler, method))
}

func (routes *Routes) setup(handler func(http.ResponseWriter, *http.Request), method string) HandlerFunc {
	return func(responsewriter http.ResponseWriter, request *http.Request) {
		routes.setupCors(responsewriter)
		if request.Method == method {
			handler(responsewriter, request)
		}
	}
}

func (routes *Routes) setupCors(responsewriter http.ResponseWriter) {
	responsewriter.Header().Set("Access-Control-Allow-Origin", "*")
	responsewriter.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	responsewriter.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	responsewriter.Header().Set("Content-Type", "application/json")
}
