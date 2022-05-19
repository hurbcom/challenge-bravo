package log

import (
	"context"
)

func ExampleNewLoggerZap() {
	log, err := NewLoggerZap(ZapConfig{
		Version:           "v0.1.0",
		DisableStackTrace: false,
	})
	if err != nil {
		// panic should not be used outside func main
		// but it is not possible to return on it tests
		panic(err)
	}

	ctx := context.Background()
	log.Info(ctx, "new log created successfully")
}

func ExampleNewLoggerZap_withTracing() {
	version := "v0.1.0"

	log, err := NewLoggerZap(ZapConfig{
		Version:           version,
		DisableStackTrace: false,
	})
	if err != nil {
		// panic should not be used outside func main
		// but it is not possible to return on it tests
		panic(err)
	}

	ctx := context.Background()
	log.Info(ctx, "new log created successfully")
}
