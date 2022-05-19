/*
Package types have some communs types that will be used on core, but still need to be used on projects.
*/
package types

type (
	// ContextKey is a type used to recover ContextKey from context.WithValue.
	ContextKey string
	// ContextKeyTime is a type used to recover ContextKeyTime from context.WithValue.
	ContextKeyTime string
)
