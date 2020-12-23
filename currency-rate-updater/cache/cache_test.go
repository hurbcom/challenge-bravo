package cache

import (
	"github.com/go-redis/redis/v7"
	. "github.com/onsi/gomega"
	"strconv"
	"testing"
)

var client *redis.Client

func TestCache(t *testing.T) {
	RegisterTestingT(t)
	config := getMockCacheConfig()
	cache, err := New(config)
	Expect(err).ShouldNot(HaveOccurred())
	defer cache.Close()
	client = MockRedisClient(config)
	defer client.Close()
	t.Run("it overrides a existent key", func(t *testing.T) {
		defer flushCache()
		setToMockRedisClient("EUR", 21.5)
		err = cache.Set("EUR", 22.5)
		Expect(err).ShouldNot(HaveOccurred())
		value, err := client.Get("EUR").Float64()
		Expect(err).ShouldNot(HaveOccurred())
		Expect(value).Should(BeEquivalentTo(22.5))
	})
	t.Run("it deletes a key", func(t *testing.T) {
		defer flushCache()
		setToMockRedisClient("EUR", 21.5)
		err = cache.Delete("EUR")
		Expect(err).ShouldNot(HaveOccurred())
		value, err := client.Get("EUR").Float64()
		Expect(err).Should(HaveOccurred())
		Expect(value).Should(BeEquivalentTo(0))
	})
}

func TestAInvalidCache(t *testing.T) {
	RegisterTestingT(t)
	config := Config{
		Host:     "",
		Password: "",
		Port:     0,
		Database: 0,
	}
	_, err := New(config)
	Expect(err).Should(HaveOccurred())
	Expect(err.Error()).Should(BeEquivalentTo("fail to instance cache: dial tcp :0: connect: connection refused"))
}

func setToMockRedisClient(key string, value float64) {
	err := client.Set(key, value, 0).Err()
	Expect(err).ShouldNot(HaveOccurred())
}

func flushCache() {
	err := client.FlushAll().Err()
	Expect(err).ShouldNot(HaveOccurred())
}

func MockRedisClient(config Config) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Host + ":" + strconv.Itoa(config.Port),
		Password: config.Password,
		DB:       config.Database,
	})
}

func getMockCacheConfig() Config {
	config := Config{
		Host:     "localhost",
		Password: "dummyPass",
		Port:     6379,
		Database: 3,
	}
	return config
}
