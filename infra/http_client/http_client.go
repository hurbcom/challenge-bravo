package http_client

import (
	"net/http"
	"time"
)

type HttpClient interface {
	Get(url string) (resp *http.Response, err error)
}

func NewHttpClient(timeout time.Duration) HttpClient {
	return &http.Client{Timeout: timeout}
}
