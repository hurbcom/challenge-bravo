package cache_test

import (
	"challenge-bravo/cache"
	"challenge-bravo/rates"
	"testing"

	"github.com/stretchr/testify/assert"
)

// Test StartCache - should initialize cache object
func TestStartCache(t *testing.T) {
	cache.StartCache()
	assert.NotNil(t, cache.Cache, "Cache object must not be nil")
}

// Test Get data from cache - should return value
func TestCacheGet(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	v, e := cache.Get("BRL")
	assert.NotEmpty(t, v, "Value must not be empty")
	assert.NoError(t, e, "Should not return error")
}

// Test Get data from cache with empty cache - should return empty value and return error
func TestCacheGetWithEmptyCache(t *testing.T) {
	// Start cache
	cache.StartCache()

	v, e := cache.Get("BRL")
	assert.Empty(t, v, "Value must be empty")
	assert.Error(t, e, "Should return error")

}

// Test Get all data from cache - should return map with values
func TestCacheGetAll(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()
	rates.UpdateRates()

	d, v, e := cache.GetAll()
	assert.NotNil(t, d, "Value must not be nil")
	assert.NotEmpty(t, v, "Value must not be empty")
	assert.NoError(t, e, "Should not return error")
}

// Test Get all data from cache with empty cache - should return error
func TestCacheGetAllWithEmptyCache(t *testing.T) {
	// Start cache and Rates update
	cache.StartCache()

	d, v, e := cache.GetAll()
	assert.Nil(t, d, "Value must be nil")
	assert.Nil(t, v, "Value must be nil")
	assert.Error(t, e, "Should return an error")
}
