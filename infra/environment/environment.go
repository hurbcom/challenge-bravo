package environment

import (
	"fmt"
	"os"
)

type (
	Environment interface {
		Get(key string) (s string, err error)
	}
	environmentImpl  struct{}
	environmentError struct {
		key string
	}
)

func NewEnvironment() Environment {
	return &environmentImpl{}
}

func (e *environmentError) Error() string {
	return fmt.Sprintf("Key %s not found", e.key)
}
func (e *environmentImpl) Get(key string) (s string, err error) {
	s = os.Getenv(key)

	if s == "" {
		return "", &environmentError{
			key: key,
		}
	}

	return s, nil

}
