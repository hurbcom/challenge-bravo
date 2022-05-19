/*
Package telemetry is responsible to handle telemetry usage.
*/
package telemetry

import (
	"context"
	"net/http"
)

// Name is a string type to hold the name of Tracer implemantation.
type Name string

// A Tracer has methods to help tracer instrumentation of our services.
type Tracer interface {
	// Middleware must return a new handler with cross application tracing (CAT) or distributed tracing.
	Middleware(next http.Handler) http.Handler
	// Client wraps parent with tracing capabilities, parent is modified during this process.
	Client(parent *http.Client) *http.Client
	// Close should be called when the application end.
	Close()
	// Return the Name of Which implementation is using ex: DataDog, NewRelic
	Name() Name
	// Get SpanFromContext given
	SpanFromContext(ctx context.Context) (Span, bool)
}

// Span interface handle span usage.
type Span interface {
	Context() SpanContext
}

// SpanContext handle spans in context.
type SpanContext interface {
	// SpanID Return the SpanID
	SpanID() uint64

	// TraceID returns the trace ID that this context is carrying.
	TraceID() uint64

	ToMap() map[string]interface{}
}
