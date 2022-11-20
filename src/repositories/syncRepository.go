package repositories

import (
	"challenge-bravo/src/models"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis"
)

type syncRepository struct {
	db *redis.Client
}

func NewSyncRepository(db *redis.Client) *syncRepository {
	return &syncRepository{db}
}

func (syncRepo syncRepository) InsertCurrency(currency models.Currency) error {

	currencyJSON, err := json.Marshal(currency)

	if err != nil {
		return err
	}

	err = syncRepo.db.Set(currency.Name, currencyJSON, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (currencyRepo syncRepository) UpdateCurrency(currency models.Currency) error {
	if err := currencyRepo.InsertCurrency(currency); err != nil {
		return err
	}

	return nil
}

func (currencyRepo syncRepository) DeleteCurrency(currencyName string) error {
	intCmd := currencyRepo.db.Del(currencyName)
	if intCmd.Val() == 0 {
		err := fmt.Errorf("currency %s not found", currencyName)
		return err
	}

	return nil
}
