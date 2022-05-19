package log

import "context"

// Field is the way the parameters is received by logger.
type Field struct {
	Key   string
	Value interface{}
}

// Any receive any value to be add into logger.
func Any(key string, value interface{}) Field {
	return Field{key, value}
}

// Error handle errors to be given to looger function.
func Error(value error) Field {
	return Field{"error", value}
}

// Fields are the slice of fields that are handled internaly by logger function.
type Fields struct {
	CTX    context.Context
	Fields []Field
}

//go:generate mockgen -destination logger_mock.go -package=log . Logger
// Logger defines a common contract we should follow for each new log provider.
type Logger interface {
	// Error logs a message at ErrorLevel. The message includes any fields passed at the log site, as well as any
	// fields accumulated on the logger.
	Error(ctx context.Context, msg string, fields ...Field)
	// Debug logs a message at DebugLevel. The message includes any fields passed at the log site, as well as any
	// fields accumulated on the logger.
	Debug(ctx context.Context, msg string, fields ...Field)
	// Fatal logs a message at FatalLevel. The message includes any fields passed at the log site, as well as any
	// fields accumulated on the logger. The logger then calls os.Exit(1), even if logging at FatalLevel is disabled.
	// Defer aren't executed before exit! Use only in appropriated places like simple main() without defer.
	Fatal(ctx context.Context, msg string, fields ...Field)
	// Info logs a message at InfoLevel. The message includes any fields passed at the log site, as well as any fields
	// accumulated on the logger.
	Info(ctx context.Context, msg string, fields ...Field)
	// Panic logs a message at PanicLevel. The message includes any fields passed at the log site, as well as any fields
	// accumulated on the logger. The logger then panics, even if logging at PanicLevel is disabled.
	Panic(ctx context.Context, msg string, fields ...Field)
	// Warn logs a message at WarnLevel. The message includes any fields passed at the log site, as well as any fields
	// accumulated on the logger.
	Warn(ctx context.Context, msg string, fields ...Field)
}
