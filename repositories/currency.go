package repositories

import (
	"fmt"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"gorm.io/gorm"
)

type currencyRepository struct {
	db *gorm.DB
}

type CurrencyRepository interface {
	CreateCurrency(currency *entities.Currency) error
	GetAllCurrencies() (*[]entities.Currency, error)
	GetCurrencyBy(column string, value string) (*entities.Currency, error)
	DeleteCurrency(id int) error
}

func InitializeCurrencyRepository(db *gorm.DB) CurrencyRepository {
	return &currencyRepository{db}
}

func (repository *currencyRepository) CreateCurrency(currency *entities.Currency) error {
	if result := repository.db.Create(&currency); result.Error != nil {
		return result.Error
	}

	return nil
}

func (repository *currencyRepository) GetAllCurrencies() (*[]entities.Currency, error) {
	var currencies []entities.Currency

	if result := repository.db.Find(&currencies); result.Error != nil {
		return nil, result.Error
	}

	return &currencies, nil
}

func (repository *currencyRepository) GetCurrencyBy(column string, value string) (*entities.Currency, error) {
	var currency entities.Currency
	query := fmt.Sprintf("%s = ?", column)

	if result := repository.db.Where(query, value).First(&currency); result.Error != nil {
		return nil, result.Error
	}

	return &currency, nil
}

func (repository *currencyRepository) DeleteCurrency(id int) error {
	var currency entities.Currency

	if result := repository.db.Delete(&currency, id); result.Error != nil {
		return result.Error
	}

	return nil
}
