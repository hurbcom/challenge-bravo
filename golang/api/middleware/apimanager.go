package middleware

import (
	"api/utils"
	"fmt"
	"net/http"
	"time"
)

type WrappedError struct {
	Context string
	Err     error
}

var limiter = utils.NewIPRateLimiter(1, 1000)

func (w *WrappedError) Error() string {
	return fmt.Sprintf("%s: %v", w.Context, w.Err)
}

func Wrap(err error, info string) *WrappedError {
	return &WrappedError{
		Context: info,
		Err:     err,
	}
}

func (*WrappedError) ServeHTTP(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	// Prevent CORS error
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	limiter := limiter.GetLimiter(r.RemoteAddr)
	if !limiter.Allow() {
		http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
		return
	}

	t := time.Now()
	next.ServeHTTP(w, r)
	fmt.Printf("Execution time: %s \n", time.Now().Sub(t).String())
	return
}
