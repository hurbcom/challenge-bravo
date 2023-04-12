package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/infra/cache"
	"time"
)

const (
	AVAILABLE_QUOTE_KEY = "qoute:available:"
	QUOTE_KEY           = "qoute:"
)

type (
	QuoteEntity struct {
		From   string `json:"from"`
		To     string `json:"to"`
		Name   string `json:"name"`
		Amount string `json:"amount"`
	}
	QuoteRepository interface {
		CheckIsAvailableQuote(from, to string) (bool, error)
		SaveQuote(entity QuoteEntity) error
		GetQuote(from, to string) (QuoteEntity, error)
		SetAvailableQuote(from, to string) error
	}

	quoteRepositoryImpl struct {
		redis cache.RedisCacheConnection
	}
)

func NewQuoteRepository(redis cache.RedisCacheConnection) QuoteRepository {
	return quoteRepositoryImpl{
		redis: redis,
	}
}

func (q quoteRepositoryImpl) CheckIsAvailableQuote(from, to string) (bool, error) {
	result, err := q.redis.Get(context.Background(), getKey("%s%s%s", AVAILABLE_QUOTE_KEY, from, to)).Bool()
	if err != nil {
		return false, err
	}

	return result, nil
}

func (q quoteRepositoryImpl) SaveQuote(entity QuoteEntity) error {
	jsonResult, err := json.Marshal(entity)

	if err != nil {
		return err
	}

	cmd := q.redis.Set(context.Background(), getKey("%s%s%s", QUOTE_KEY, entity.From, entity.To), jsonResult, time.Second)

	if cmd.Err() != nil {
		return cmd.Err()
	}

	return nil
}

func (q quoteRepositoryImpl) GetQuote(from, to string) (QuoteEntity, error) {
	result, err := q.redis.Get(context.Background(), getKey("%s%s%s", QUOTE_KEY, from, to)).Bytes()

	if err != nil {
		return QuoteEntity{}, err
	}
	var quote QuoteEntity

	err = json.Unmarshal(result, &quote)

	if err != nil {
		return QuoteEntity{}, err
	}

	return quote, nil

}

func (q quoteRepositoryImpl) SetAvailableQuote(from, to string) error {
	cmd := q.redis.Set(context.TODO(), getKey("%s%s%s", AVAILABLE_QUOTE_KEY, from, to), true, 0)

	if cmd.Err() != nil {
		return cmd.Err()
	}
	return nil
}

func getKey(format string, params ...string) string {
	return fmt.Sprintf(format, params)
}
