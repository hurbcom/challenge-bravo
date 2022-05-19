package log

import (
	"context"

	"challenge-bravo/pkg/core/telemetry"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

const traceKeyNumber int = 3

var _ Logger = (*Zap)(nil)

// Zap wraps a zap.Logger and implements Logger inteface.
type Zap struct {
	logger *zap.Logger
	tracer telemetry.Tracer
}

// ZapConfig handle the config information that will be passed to zap.
type ZapConfig struct {
	Version           string
	DisableStackTrace bool
	Tracer            telemetry.Tracer
	Debug             bool `env:"DEBUG"`
}

// NewLoggerZap implements Logger using uber zap structured log package.
func NewLoggerZap(config ZapConfig) (*Zap, error) {
	loggerConfig := zap.NewProductionConfig()
	loggerConfig.EncoderConfig.TimeKey = "timestamp"
	loggerConfig.EncoderConfig.EncodeTime = zapcore.RFC3339NanoTimeEncoder
	loggerConfig.DisableStacktrace = config.DisableStackTrace
	loggerConfig.InitialFields = map[string]interface{}{
		"version": config.Version,
	}
	if config.Debug {
		loggerConfig.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	}

	logger, err := loggerConfig.Build(zap.AddCallerSkip(1))
	if err != nil {
		return nil, errors.Wrap(err, "error on building zap logger")
	}

	return &Zap{
		logger: logger,
		tracer: config.Tracer,
	}, nil
}

// fieldsToZap convert Fields ([]Field) to []zap.Field.
// and enbed span trace from context.
func fieldsToZap(ctx context.Context, tracer telemetry.Tracer, fs []Field) []zap.Field {
	zapFields := make([]zap.Field, len(fs), len(fs)+1)

	for i := range fs {
		zapFields[i] = zap.Any(fs[i].Key, fs[i].Value)
	}

	tracerMap := make(map[string]interface{}, traceKeyNumber)
	if reqID := middleware.GetReqID(ctx); reqID != "" {
		tracerMap["requestID"] = reqID
	}

	if tracer != nil {
		if span, ok := tracer.SpanFromContext(ctx); ok {
			spanCtx := span.Context()
			tracerMap["traceID"] = spanCtx.TraceID()
			tracerMap["spanID"] = spanCtx.SpanID()
		}
	}

	if tracerMap["requestID"] != nil || tracerMap["traceID"] != nil {
		zapFields = append(zapFields, zap.Any(telemetry.TracerKey, tracerMap))
	}

	return zapFields
}

// Debug will write a log with level debug.
func (z *Zap) Debug(ctx context.Context, msg string, fields ...Field) {
	z.logger.Debug(msg, fieldsToZap(ctx, z.tracer, fields)...)
}

// Error will write a log with level error.
func (z *Zap) Error(ctx context.Context, msg string, fields ...Field) {
	z.logger.Error(msg, fieldsToZap(ctx, z.tracer, fields)...)
}

// Fatal will write a log with level fatal.
func (z *Zap) Fatal(ctx context.Context, msg string, fields ...Field) {
	z.logger.Fatal(msg, fieldsToZap(ctx, z.tracer, fields)...)
}

// Info will write a log with level info.
func (z *Zap) Info(ctx context.Context, msg string, fields ...Field) {
	z.logger.Info(msg, fieldsToZap(ctx, z.tracer, fields)...)
}

// Panic will write a log with level panic.
func (z *Zap) Panic(ctx context.Context, msg string, fields ...Field) {
	z.logger.Panic(msg, fieldsToZap(ctx, z.tracer, fields)...)
}

// Warn will write a log with level warn.
func (z *Zap) Warn(ctx context.Context, msg string, fields ...Field) {
	z.logger.Warn(msg, fieldsToZap(ctx, z.tracer, fields)...)
}
