package repositories

import (
	"fmt"

	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"gorm.io/gorm"
)

type currencyRepository struct {
	db *gorm.DB
}

type CurrencyRepository interface {
	CreateCurrency(currency *models.Currency) error
	GetAllCurrencies() (*[]models.Currency, error)
	GetCurrencyBy(column string, value string) (*models.Currency, error)
	DeleteCurrency(id int) error
}

func InitializeCurrencyRepository(db *gorm.DB) CurrencyRepository {
	return &currencyRepository{db}
}

func (repository *currencyRepository) CreateCurrency(currency *models.Currency) error {
	if result := repository.db.Create(&currency); result.Error != nil {
		return result.Error
	}

	return nil
}

func (repository *currencyRepository) GetAllCurrencies() (*[]models.Currency, error) {
	var currencies []models.Currency

	if result := repository.db.Find(&currencies); result.Error != nil {
		return nil, result.Error
	}

	return &currencies, nil
}

func (repository *currencyRepository) GetCurrencyBy(column string, value string) (*models.Currency, error) {
	var currency models.Currency
	query := fmt.Sprintf("%s = ?", column)

	if result := repository.db.Where(query, value).First(&currency); result.Error != nil {
		return nil, result.Error
	}

	return &currency, nil
}

func (repository *currencyRepository) DeleteCurrency(id int) error {
	var currency models.Currency

	if result := repository.db.Delete(&currency, id); result.Error != nil {
		return result.Error
	}

	return nil
}
