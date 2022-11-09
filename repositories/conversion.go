package repositories

import (
	"github.com/felipepnascimento/challenge-bravo-flp/models"
	"github.com/jmoiron/sqlx"
)

type conversionRepository struct {
	db *sqlx.DB
}

type ConversionRepository interface {
	CreateConversion(conversion *models.Conversion) error
}

func InitializeConversionRepository(db *sqlx.DB) ConversionRepository {
	return &conversionRepository{db}
}

func (repository *conversionRepository) CreateConversion(conversion *models.Conversion) error {
	tx, err := repository.db.Beginx()
	if err != nil {
		return err
	}

	err = insertConversion(tx, conversion)
	if err != nil {
		return err
	}

	if err == nil {
		return tx.Commit()
	} else {
		return tx.Rollback()
	}
}

func insertConversion(tx *sqlx.Tx, conversion *models.Conversion) error {
	_, err := tx.NamedExec(`
		INSERT INTO conversions("from", "to", amount, result)
		VALUES (:from, :to, :amount, :result);
	`, conversion)

	return err
}
