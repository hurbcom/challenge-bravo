package repositories

import (
	"api/src/models"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis"
)

type currencies struct {
	db *redis.Client
}

func NewCurrencyRepository(db *redis.Client) *currencies {
	return &currencies{db}
}

func (currencyRepo currencies) GetAllCurrencies() ([]models.Currency, error) {

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

func (currencyRepo currencies) GetAllUpdatableCurrencies() ([]models.Currency, error) {

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

func (currencyRepo currencies) GetCurrencyByName(currencyName string) (models.Currency, error) {

	var currencyFromDatabase models.Currency

	dbResultJSON, err := currencyRepo.db.Get(currencyName).Result()

	if err != nil {
		fmt.Println("error getting currency from database:", err)
		return models.Currency{}, err
	}

	err = json.Unmarshal([]byte(dbResultJSON), &currencyFromDatabase)
	if err != nil {
		fmt.Println("error unmarshalling dbResultJSON:", err)
	}

	return currencyFromDatabase, nil
}

func (currencyRepo currencies) InsertCurrency(currency models.Currency) error {

	currencyJSON, err := json.Marshal(currency)

	if err != nil {
		return err
	}

	err = currencyRepo.db.Set(currency.Name, currencyJSON, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (currencyRepo currencies) UpdateCurrency(currency models.Currency) error {
	if err := currencyRepo.InsertCurrency(currency); err != nil {
		return err
	}

	return nil
}

func (currencyRepo currencies) DeleteCurrency(currencyName string) *redis.IntCmd {
	return currencyRepo.db.Del(currencyName)
}
