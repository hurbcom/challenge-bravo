package services

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetCurrencyRate(t *testing.T) {
	response, err := GetCurrencyRate("BRL")

	assert.Nil(t, err)
	assert.NotEqual(t, 0, response)
}
