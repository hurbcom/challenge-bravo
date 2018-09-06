package sliceutil

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestContains(t *testing.T) {
	fib := []int{1, 1, 2, 3, 5, 8, 13}
	assert.Equal(t, true, Contains(fib, 1))
	assert.Equal(t, false, Contains(fib, 0))
	assert.Equal(t, true, Contains(fib, 13))
	assert.Equal(t, false, Contains(fib, "2"))
	assert.Equal(t, false, Contains(fib, nil))
}
