package testutils

import (
	"testing"
)

func RunTest(testFunc func(*testing.T)) func(*testing.T) {
	return func(t *testing.T) {
		beforeEach()
		testFunc(t)
		afterEach()
	}
}
