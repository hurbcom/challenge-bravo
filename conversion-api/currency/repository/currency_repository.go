package repository

import (
	"challenge-bravo/conversion-api/currency"
	"fmt"
	"challenge-bravo/conversion-api/models"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type repository struct {
	db *sql.DB
}

const(
	driver = "mysql"
	dataSourceName = "root:root@tcp(172.28.1.1)/conversion"
)

//NewRepository instatiates a new Repository
func NewRepository() (currency.Repository, error) {
	var r repository
	err := r.connect()

	if err != nil {
		return nil, err
	}

	return &r, nil
}

func (r *repository) connect() error {
	r.db, err := sql.Open(driver, dataSourceName)

	if err != nil {
		return err
	}

	return r.ping()
}

func (r *repository) ping() error {
	return  r.db.Ping()
}


func (r *repository) GetCurrency(ctx context.Context, currencyName string) (models.Currency, error) {
	stmt, err := r.db.Prepare("SELECT id, name, ballast_to_dollar, updated_at FROM conversion.currency WHERE name = ?")

	if err != nil {
		return nil, err
	}

	res, err := stmt.Query(currencyName)

	if err != nil {
		return nil, err
	}

	var currency models.Currency

	if err := res.Scan(&currency.ID, &currency.Name, &currency.BallastToDollar, &currency.Timestamp); err != nil {
		return nil, err
	}

	return currency, nil
}
func (r *repository) UpdateBallast(ctx context.Context, currency models.Currency) error {
	stmt, err := r.db.Prepare("UPDATE conversion.currency SET ballast_to_dollar = ?,  updated_at = ? WHERE name = ?AND id = ?")

	if err != nil {
		return err
	}

	res, err := stmt.Exec(currency.BallastToDollar, currency.Timestamp, currencyName, currency.ID)

	if err != nil {
		return err
	}

	nRows, _ := res.RowsAffected()

	if nRows < 1 {
		return fmt.Errorf("Error no lines where affected during update of Ballast")
	}
	
	return nil
}
func (r *repository) InsertCurrency(ctx context.Context, currency models.Currency) (models.Currency, error) {
	return nil, nil
}