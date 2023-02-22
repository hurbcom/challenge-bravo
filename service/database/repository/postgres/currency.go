package repository

import (
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/lib/pq"
)

type Currency struct{}

func NewCurrency() repository.Currency {
	return &Currency{}
}

func (*Currency) Insert(currencyModel *model.Currency) (*model.Currency, error) {
	query :=
		`INSERT INTO 
			currencies
			(short_name, rate_usd, reference_date)
		VALUES
			($1, $2, $3)
		RETURNING *;`

	row := conn.QueryRow(
		query,
		currencyModel.ShortName,
		currencyModel.RateUSD,
		currencyModel.ReferenceDate,
	)

	currencyInserted := &model.Currency{}

	err := row.Scan(
		&currencyInserted.ID,
		&currencyInserted.ShortName,
		&currencyInserted.RateUSD,
		&currencyInserted.ReferenceDate,
		&currencyInserted.CreatedAt,
	)

	// repository error duplicate key
	if errPQ, ok := err.(*pq.Error); ok {
		if errPQ.Code == "23505" {
			err = repository.ErrDuplicateKey{Message: errPQ.Detail}
		}
	}

	return currencyInserted, err
}

func (*Currency) GetByID(id int64) (*model.Currency, error) {
	query :=
		`SELECT
			id, short_name, rate_usd, reference_date, created_at
		FROM
			currencies
		WHERE
			id = $1`

	row := conn.QueryRow(query, id)

	currencyModel := model.Currency{}

	err := row.Scan(
		&currencyModel.ID,
		&currencyModel.ShortName,
		&currencyModel.RateUSD,
		&currencyModel.ReferenceDate,
		&currencyModel.CreatedAt,
	)

	// repository error not found
	if err != nil && err.Error() == "sql: no rows in result set" {
		err = repository.ErrNotFound{Message: err.Error()}
	}

	return &currencyModel, err
}

func (*Currency) GetByShortName(shortName string) (*model.Currency, error) {
	query :=
		`SELECT
			id, short_name, rate_usd, reference_date, created_at
		FROM
			currencies
		WHERE
			short_name = $1`

	row := conn.QueryRow(query, shortName)

	currencyModel := model.Currency{}

	err := row.Scan(
		&currencyModel.ID,
		&currencyModel.ShortName,
		&currencyModel.RateUSD,
		&currencyModel.ReferenceDate,
		&currencyModel.CreatedAt,
	)

	// err.(*errors.errorString)
	if err != nil && err.Error() == "sql: no rows in result set" {
		err = repository.ErrNotFound{Message: err.Error()}
	}
	// repository error not found

	// if errors.As(err, *errors.errorString)
	// if errS, ok := err.(errtst); ok {
	// 	if errS.s == "sql: no rows in result set" {
	// 		err = repository.ErrDuplicateKey{Message: errS.s}
	// 	}
	// }

	return &currencyModel, err
}

func (*Currency) List() (*model.Currencies, error) {
	query :=
		`SELECT
			id, short_name, rate_usd, reference_date, created_at
		FROM
			currencies`

	rows, err := conn.Query(query)

	currenciesModel := model.Currencies{}

	if err != nil {
		return &currenciesModel, err
	}

	defer rows.Close()

	for rows.Next() {
		currencyModel := model.Currency{}

		err = rows.Scan(
			&currencyModel.ID,
			&currencyModel.ShortName,
			&currencyModel.RateUSD,
			&currencyModel.ReferenceDate,
			&currencyModel.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		currenciesModel = append(currenciesModel, currencyModel)
	}

	return &currenciesModel, err
}

func (*Currency) Update(currencyModel *model.Currency) (*model.Currency, error) {
	query :=
		`UPDATE
		currencies
	SET
		short_name = $2,
		rate_usd = $3,
		reference_date = $4
	WHERE
		id = $1
	RETURNING *;`

	row := conn.QueryRow(
		query,
		currencyModel.ID,
		currencyModel.ShortName,
		currencyModel.RateUSD,
		currencyModel.ReferenceDate,
	)

	currencyUpdatedModel := &model.Currency{}

	err := row.Scan(
		&currencyUpdatedModel.ID,
		&currencyUpdatedModel.ShortName,
		&currencyUpdatedModel.RateUSD,
		&currencyUpdatedModel.ReferenceDate,
		&currencyUpdatedModel.CreatedAt,
	)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			// repository error not found
			err = repository.ErrNotFound{Message: err.Error()}
		} else if errPQ, ok := err.(*pq.Error); ok {
			// repository error duplicate key
			if errPQ.Code == "23505" {
				err = repository.ErrDuplicateKey{Message: errPQ.Detail}
			}
		}
	}

	return currencyUpdatedModel, err
}

func (*Currency) Delete(id int64) error {
	query :=
		`DELETE FROM
		currencies
	WHERE
		id = $1`

	result, err := conn.Exec(query, id)

	if err == nil {
		rowsAffected, errRA := result.RowsAffected()

		if errRA != nil {
			err = errRA
		} else if rowsAffected == 0 {
			err = repository.ErrNotFound{}
		}
	}

	return err
}
