package middleware

import (
	"context"
	"net/http"
	"time"

	"challenge-bravo/pkg/core/log"

	"github.com/pkg/errors"
)

// wrapWriter implements http.ResponseWriter and saves status and size for logging.
type wrapWriter struct {
	http.ResponseWriter
	status      int
	size        int
	wroteHeader bool
}

// Write writes the data to the connection as part of an HTTP reply.
//
// If WriteHeader has not yet been called, Write calls
// WriteHeader(http.StatusOK) before writing the data. If the Header
// does not contain a Content-Type line, Write adds a Content-Type set
// to the result of passing the initial 512 bytes of written data to
// DetectContentType. Additionally, if the total size of all written
// data is under a few KB and there are no Flush calls, the
// Content-Length header is added automatically.
//
// Depending on the HTTP protocol version and the client, calling
// Write or WriteHeader may prevent future reads on the
// Request.Body. For HTTP/1.x requests, handlers should read any
// needed request body data before writing the response. Once the
// headers have been flushed (due to either an explicit Flusher.Flush
// call or writing enough data to trigger a flush), the request body
// may be unavailable. For HTTP/2 requests, the Go HTTP server permits
// handlers to continue to read the request body while concurrently
// writing the response. However, such behavior may not be supported
// by all HTTP/2 clients. Handlers should read before writing if
// possible to maximize compatibility.
func (r *wrapWriter) Write(data []byte) (int, error) {
	if !r.wroteHeader {
		r.WriteHeader(http.StatusOK)
	}
	n, err := r.ResponseWriter.Write(data)
	r.size += n

	return n, errors.Wrap(err, "log wrapper unable to write response")
}

// WriteHeader sends an HTTP response header with the provided
// status code.
//
// If WriteHeader is not called explicitly, the first call to Write
// will trigger an implicit WriteHeader(http.StatusOK).
// Thus explicit calls to WriteHeader are mainly used to
// send error codes.
//
// The provided code must be a valid HTTP 1xx-5xx status code.
// Only one header may be written. Go does not currently
// support sending user-defined 1xx informational headers,
// with the exception of 100-continue response header that the
// Server sends automatically when the Request.Body is read.
func (r *wrapWriter) WriteHeader(statusCode int) {
	if r.wroteHeader {
		return
	}
	r.status = statusCode
	r.wroteHeader = true
	r.ResponseWriter.WriteHeader(statusCode)
}

func statusLevel(logger log.Logger, status int) func(ctx context.Context, msg string, fields ...log.Field) {
	switch {
	case status <= 0:
		return logger.Warn
	case status < http.StatusBadRequest: // for codes in 100s, 200s, 300s
		return logger.Info
	case status >= http.StatusBadRequest && status < http.StatusInternalServerError:
		return logger.Warn
	case status >= http.StatusInternalServerError:
		return logger.Error
	default:
		return logger.Info
	}
}

// Logger middleware is a middleware to log everything request that was receved by API.
func Logger(logger log.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			writer := &wrapWriter{status: http.StatusOK, ResponseWriter: w}
			tt := time.Now()

			next.ServeHTTP(writer, r)

			statusLevel(logger, writer.status)(
				r.Context(),
				"http",
				log.Any("method", r.Method),
				log.Any("path", r.URL.Path),
				log.Any("from", r.RemoteAddr),
				log.Any("status", writer.status),
				log.Any("size_bytes", writer.size),
				log.Any("elapsed_seconds", time.Since(tt).Seconds()),
				log.Any("elapsed", time.Since(tt).String()),
			)
		})
	}
}
