package middleware

import (
	"net/http"
	"runtime/debug"

	"challenge-bravo/pkg/core/log"
)

const panicErrorRecovered string = "panic recovered on middleware recoverer"

// Recoverer middleware recover panic if it hapens into a request avoiding the application stop due uncacthed panic.
func Recoverer(logger log.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rvr := recover(); rvr != nil {
					logger.Error(
						r.Context(),
						panicErrorRecovered,
						log.Any("recover", rvr),
						log.Any("debug", string(debug.Stack())),
					)
					w.WriteHeader(http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		}

		return http.HandlerFunc(fn)
	}
}
