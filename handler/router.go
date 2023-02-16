package handler

import "net/http"

type Router interface {
	Serve() http.Handler
	Get(path string, f func(rw http.ResponseWriter, req *http.Request))
	Post(path string, f func(rw http.ResponseWriter, req *http.Request))
	Put(path string, f func(rw http.ResponseWriter, req *http.Request))
	Delete(path string, f func(rw http.ResponseWriter, req *http.Request))
}
