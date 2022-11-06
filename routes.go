package main

import (
	"net/http"
)

type Routes struct {
}

type HandlerFunc func(http.ResponseWriter, *http.Request)

func (routes *Routes) RegisterAll() {
	routes.register("/", map[string]HandlerFunc{
		http.MethodPost:   CreateHandler,
		http.MethodDelete: DeleteHandler,
	})
	routes.register("/conversions", map[string]HandlerFunc{
		http.MethodGet: ConversionsHandler,
	})
}

func (routes *Routes) register(route string, handlers map[string]HandlerFunc) {
	http.HandleFunc(route, routes.setup(handlers))
}

func (routes *Routes) setup(handlers map[string]HandlerFunc) HandlerFunc {
	return func(responseWriter http.ResponseWriter, request *http.Request) {
		routes.setupCors(responseWriter)
		if handler, ok := handlers[request.Method]; ok {
			handler(responseWriter, request)
		} else {
			responseWriter.WriteHeader(http.StatusNotFound)
			_, err := responseWriter.Write([]byte{})
			if err != nil {
				http.Error((responseWriter), err.Error(), http.StatusBadRequest)
			}
		}
	}
}

func (routes *Routes) setupCors(responsewriter http.ResponseWriter) {
	responsewriter.Header().Set("Access-Control-Allow-Origin", "*")
	responsewriter.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	responsewriter.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	responsewriter.Header().Set("Content-Type", "application/json")
}
