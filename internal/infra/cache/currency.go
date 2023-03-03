package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"
	"github.com/redis/go-redis/v9"
)

type CurrencyCacheRepository struct {
	client *redis.Client
	ttl    time.Duration
}

const CACHE_KEY_PREFIX = "currency:%s"

func NewCurrencyCacheRepository(cacheClient *CacheClient, expirationInMinutes string) *CurrencyCacheRepository {
	ttl, err := time.ParseDuration(fmt.Sprintf("%sm", expirationInMinutes))
	if err != nil {
		log.Fatalf(fmt.Sprintf("Redis TTL must be a valid time.Duration. Got '%s'", expirationInMinutes))
	}

	return &CurrencyCacheRepository{
		client: cacheClient.client,
		ttl:    ttl,
	}
}

func (repository *CurrencyCacheRepository) GetCurrency(name string) *entity.Currency {
	value, err := repository.client.Get(context.TODO(), repository.getCurrencyKey(name)).Result()
	if err != nil {
		return nil
	}

	var currency entity.Currency
	err = json.Unmarshal([]byte(value), &currency)
	if err != nil {
		return nil
	}

	return &currency
}

func (repository *CurrencyCacheRepository) CreateCurrency(currency *entity.Currency) bool {
	value, err := json.Marshal(currency)
	if err != nil {
		return false
	}

	err = repository.client.Set(context.TODO(), repository.getCurrencyKey(currency.Name), value, repository.ttl).Err()
	if err != nil {
		return false
	}

	return true
}

func (repository *CurrencyCacheRepository) DeleteCurrency(name string) bool {
	err := repository.client.Del(context.TODO(), repository.getCurrencyKey(name)).Err()
	if err != nil {
		return false
	}

	return true
}

func (repository *CurrencyCacheRepository) getCurrencyKey(name string) string {
	return fmt.Sprintf(CACHE_KEY_PREFIX, name)
}
