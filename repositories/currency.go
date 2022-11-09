package repositories

import (
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/jmoiron/sqlx"
)

type currencyRepository struct {
	db *sqlx.DB
}

type CurrencyRepository interface {
	CreateCurrency(currency *models.Currency) error
	GetAllCurrencies() (*[]models.Currency, error)
	GetCurrencyById(id int) (*models.Currency, error)
	GetCurrencyByKey(key string) (*models.Currency, error)
	DeleteCurrency(id int) error
}

func InitializeCurrencyRepository(db *sqlx.DB) CurrencyRepository {
	return &currencyRepository{db}
}

func (repository *currencyRepository) CreateCurrency(currency *models.Currency) error {
	tx, err := repository.db.Beginx()
	if err != nil {
		return err
	}

	err = insertCurrency(tx, currency)
	if err != nil {
		return err
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return nil
}

func (repository *currencyRepository) GetAllCurrencies() (*[]models.Currency, error) {
	var currencies []models.Currency

	rows, err := repository.db.Queryx(`SELECT * FROM currencies`)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var currency models.Currency
		err = rows.StructScan(&currency)
		if err != nil {
			return nil, err
		}
		currencies = append(currencies, currency)
	}

	return &currencies, nil
}

func (repository *currencyRepository) GetCurrencyById(id int) (*models.Currency, error) {
	var currency models.Currency

	err := repository.db.Get(&currency, `SELECT id, key, description FROM currencies WHERE id=$1;`, id)

	if err != nil {
		return nil, err
	}

	return &currency, nil
}

func (repository *currencyRepository) GetCurrencyByKey(key string) (*models.Currency, error) {
	var currency models.Currency

	err := repository.db.Get(&currency, `SELECT id, key, description FROM currencies WHERE key=$1;`, key)

	if err != nil {
		return nil, err
	}

	return &currency, nil
}

func (repository *currencyRepository) DeleteCurrency(id int) error {
	tx, err := repository.db.Beginx()
	if err != nil {
		return err
	}

	_, err = tx.Exec(`DELETE FROM currencies WHERE id=$1;`, id)
	if err != nil {
		return err
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return nil
}

func insertCurrency(tx *sqlx.Tx, currency *models.Currency) error {
	_, err := tx.NamedExec(`
		INSERT INTO currencies(key, description, exchange_api)
		VALUES (:key, :description, :exchange_api);
	`, currency)

	return err
}
