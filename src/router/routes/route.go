package routes

import "net/http"

type Route struct {
	URL    string
	Func   func(w http.ResponseWriter, r *http.Request)
	Method string
	IsAuth bool
}
