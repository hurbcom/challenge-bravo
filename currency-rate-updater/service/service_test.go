package service

import (
	"context"
	"github.com/go-redis/redis/v7"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/cache"
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service/server/currency"
	. "github.com/onsi/gomega"
	"google.golang.org/grpc"
	"strconv"
	"testing"
	"time"
)

func TestService(t *testing.T) {
	RegisterTestingT(t)
	cfg := getMockConfig()
	servce, err := New(cfg)
	Expect(err).ShouldNot(HaveOccurred())
	servce.Run()
	defer servce.Shutdown()
	cacheClient := MockRedisClient(cfg.Cache)
	conn, err := grpc.Dial(":"+strconv.Itoa(cfg.ServerPort), grpc.WithInsecure(), grpc.WithBlock())
	Expect(err).ShouldNot(HaveOccurred())
	defer conn.Close()
	client := currency.NewCurrencyServiceClient(conn)
	t.Run("It checks server update currency rate", func(t *testing.T) {
		flushCache(cacheClient)
		Eventually(func() float64 {
			value, _ := cacheClient.Get("EUR").Float64()
			return value
		}, 4*time.Second, 100*time.Millisecond).ShouldNot(BeZero())
	})
	t.Run("It adds a new currency", func(t *testing.T) {
		flushCache(cacheClient)
		_, err := cacheClient.Get("USD").Float64()
		Expect(err).Should(HaveOccurred())
		Expect(err).Should(BeEquivalentTo(redis.Nil))
		req := &currency.Request{Code: "USD"}
		resp, err := client.AddCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
		value, err := cacheClient.Get("USD").Float64()
		Expect(err).ShouldNot(HaveOccurred())
		Expect(value).ShouldNot(BeZero())
	})
	t.Run("It adds a invalid currency", func(t *testing.T) {
		flushCache(cacheClient)
		req := &currency.Request{Code: "USDD"}
		resp, err := client.AddCurrency(context.Background(), req)
		Expect(err).Should(HaveOccurred())
		Expect(err.Error()).Should(BeEquivalentTo("rpc error: code = Unknown desc = currency does not exist"))
		Expect(resp).Should(BeNil())
	})
	t.Run("It removes a currency", func(t *testing.T) {
		flushCache(cacheClient)
		req := &currency.Request{Code: "EUR"}
		resp, err := client.RemoveCurrency(context.Background(), req)
		Expect(err).ShouldNot(HaveOccurred())
		Expect(resp.Success).Should(BeTrue())
		_, err = cacheClient.Get("USD").Float64()
		Expect(err).Should(HaveOccurred())
		Expect(err).Should(BeEquivalentTo(redis.Nil))
	})
	t.Run("It removes a nonexistent currency", func(t *testing.T) {
		flushCache(cacheClient)
		req := &currency.Request{Code: "EURR"}
		resp, err := client.RemoveCurrency(context.Background(), req)
		Expect(err).Should(HaveOccurred())
		Expect(err.Error()).Should(BeEquivalentTo("rpc error: code = Unknown desc = currency does not exist"))
		Expect(resp).Should(BeNil())
	})
}

func getMockConfig() *Config {
	return &Config{
		Cache: cache.Config{
			Host:     "localhost",
			Password: "dummyPass",
			Port:     6379,
			Database: 0,
		},
		LogLevel:          6,
		PullingTime:       "1ms",
		AllowedCurrencies: []string{"EUR"},
		ServerPort:        3001,
	}
}

func MockRedisClient(config cache.Config) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.Host + ":" + strconv.Itoa(config.Port),
		Password: config.Password,
		DB:       config.Database,
	})
}

func flushCache(client *redis.Client) {
	err := client.FlushAll().Err()
	Expect(err).ShouldNot(HaveOccurred())
}
