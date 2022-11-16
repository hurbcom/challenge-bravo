package repositories

import (
	"api/src/models"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis"
)

type currencyRepository struct {
	db *redis.Client
}

func NewCurrencyRepository(db *redis.Client) *currencyRepository {
	return &currencyRepository{db}
}

func (currencyRepo currencyRepository) GetAllCurrencies() ([]models.Currency, error) {

	var currencies []models.Currency

	dbResultIterator := currencyRepo.db.Scan(0, "*", 0).Iterator()

	for i := 0; dbResultIterator.Next(); i++ {

		currencyFromDatabase, err := currencyRepo.GetCurrencyByName(dbResultIterator.Val())
		if err != nil {
			return nil, err
		}

		currencies = append(currencies, currencyFromDatabase)

	}

	return currencies, nil
}

func (currencyRepo currencyRepository) GetAllUpdatableCurrencies() ([]models.Currency, error) {

	currencies, err := currencyRepo.GetAllCurrencies()
	if err != nil {
		return nil, err
	}

	var updatableCurrencies []models.Currency

	for _, currency := range currencies {
		if currency.IsAutoUpdatable {
			updatableCurrencies = append(updatableCurrencies, currency)
		}
	}

	return updatableCurrencies, nil
}

func (currencyRepo currencyRepository) GetCurrencyByName(currencyName string) (models.Currency, error) {

	var currencyFromDatabase models.Currency

	dbResultJSON, err := currencyRepo.db.Get(currencyName).Result()

	if err == redis.Nil {
		err = fmt.Errorf("no results found for key %s", currencyName)
		return models.Currency{}, err
	}

	if err != nil {
		fmt.Println("error getting currency from database:", err)
		return models.Currency{}, err
	}

	err = json.Unmarshal([]byte(dbResultJSON), &currencyFromDatabase)
	if err != nil {
		fmt.Println("error unmarshalling dbResultJSON:", err)
		return models.Currency{}, err
	}

	return currencyFromDatabase, nil
}
