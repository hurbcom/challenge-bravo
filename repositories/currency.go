package repositories

import (
	"errors"

	entities "github.com/felipepnascimento/challenge-bravo-flp/entities"
	"github.com/jmoiron/sqlx"
)

type currencyRepository struct {
	db *sqlx.DB
}

type CurrencyRepository interface {
	GetAllCurrencies() (*[]entities.Currency, error)
	GetCurrencyByID(id int) (*entities.Currency, error)
	SearchCurrencyByText(text string) (*[]entities.Currency, error)
	CreateCurrency(currency *entities.Currency) error
	DeleteCurrency(id int) error
}

func InitializeCurrencyRepository(db *sqlx.DB) CurrencyRepository {
	return &currencyRepository{db}
}

func (repository *currencyRepository) GetAllCurrencies() (*[]entities.Currency, error) {
	var result []entities.Currency
	rows, err := repository.db.Queryx(`SELECT id, username, text, created_at, modified_at FROM currencys`)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var currency entities.Currency
		err = rows.StructScan(&currency)
		if err != nil {
			return nil, err
		}
		result = append(result, currency)
	}

	return &result, err
}

func (repository *currencyRepository) GetCurrencyByID(id int) (*entities.Currency, error) {
	var currency entities.Currency

	err := repository.db.Get(&currency, `SELECT id, username, text, created_at, modified_at FROM currencys WHERE id=$1;`, id)
	if err != nil {
		return nil, err
	}

	return &currency, nil
}

func (repository *currencyRepository) SearchCurrencyByText(text string) (*[]entities.Currency, error) {
	var result []entities.Currency

	rows, err := repository.db.Queryx(`SELECT id, username, text, created_at, modified_at FROM currencys WHERE text ILIKE $1;`, text)
	for rows.Next() {
		var currency entities.Currency
		err = rows.StructScan(&currency)
		result = append(result, currency)
	}

	return &result, err
}

func (repository *currencyRepository) CreateCurrency(currency *entities.Currency) error {
	var err error

	if currency == nil {
		return errors.New("currency can not be nil")
	}

	tx, err := repository.db.Beginx()
	if err != nil {
		return err
	} else {
		err = insertCurrency(tx, currency)
		if err != nil {
			return err
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return err
}

func insertCurrency(tx *sqlx.Tx, currency *entities.Currency) error {
	_, err := tx.NamedExec(`
		INSERT INTO currencys(username, text)
		VALUES (:username, :text);
	`, currency)

	return err
}

func (repository *currencyRepository) DeleteCurrency(id int) error {
	var err error

	tx, errTx := repository.db.Beginx()
	if errTx != nil {
	} else {
		err = deleteCurrency(tx, id)
		if err != nil {
		}
	}

	if err == nil {
		tx.Commit()
	} else {
		tx.Rollback()
	}

	return err
}

func deleteCurrency(tx *sqlx.Tx, id int) error {
	_, err := tx.Exec(`
		DELETE FROM currencys WHERE id=$1;
	`, id)

	return err
}
