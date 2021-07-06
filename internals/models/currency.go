package models

import (
    "context"
    "database/sql"
    "fmt"
)

type Currency struct {
    ID     int     `database:"id" json:"id"`
    Symbol string  `database:"symbol" json:"symbol" validate:"required"`
    Value  float64 `database:"value" json:"value" validate:"required,gt=0"`
}

type Currencies struct {
    Currencies []Currency `json:"currencies"`
}

func (currs *Currencies) GetAllCurrencies() error {

    query := `SELECT id, symbol, value FROM currencies`

    resultSet, err := pool.Query(context.Background(), query)
    if err != nil {
        return err
    }
    // go over ther resultset parsing currencies
    for resultSet.Next() {
        curr := Currency{}
        err = resultSet.Scan(&curr.ID, &curr.Symbol, &curr.Value)
        // if no rows is found, a specific error is thrown
        switch err {
        case nil:
        case sql.ErrNoRows:
            return fmt.Errorf("currencies table is empty")
        default:
            return err
        }
        currs.Currencies = append(currs.Currencies, curr)
    }

    return nil
}

func (curr *Currency) GetCurrency(symbol string) error {
    // prepare the query
    query := `SELECT id, symbol, value FROM currencies WHERE symbol = $1;`
    // query the currency
    if err := pool.QueryRow(context.Background(), query, symbol).Scan(&curr.ID, &curr.Symbol, &curr.Value); err != nil {
        return fmt.Errorf("currency %v not found", symbol)
    }

    return nil
}

func (curr *Currency) PostCurrency() error {

    // check if currency exists
    foundCurr, err := pool.Query(context.Background(), "SELECT * FROM currencies WHERE symbol = $1;", curr.Symbol)
    if err != nil {
        return err
    }

    defer foundCurr.Close()
    // check if there is a row in the resultset
    if foundCurr.Next() {
        return fmt.Errorf("currency is already in the database")
    }
    // inserting
    query := `INSERT INTO currencies (symbol, value) VALUES ($1, $2) RETURNING id;`
    if err = pool.QueryRow(context.Background(), query, curr.Symbol, curr.Value).Scan(&curr.ID); err != nil {
        return err
    }

    return nil
}

func (curr *Currency) PutCurrency() error {
    query := `UPDATE currencies set value = $1 WHERE symbol = $2 RETURNING *;`

    if err := pool.QueryRow(context.Background(), query, curr.Value, curr.Symbol).Scan(&curr.ID, &curr.Symbol, &curr.Value); err != nil {
        return fmt.Errorf("currency %v not found", curr.Symbol)
    }

    return nil
}

func (curr *Currency) DeleteCurrency() error {
    query := `DELETE FROM currencies WHERE symbol = $1 RETURNING *;`

    // executing the delete query
    affectedRow, err := pool.Query(context.Background(), query, curr.Symbol)
    if err != nil {
        return err
    }
    // check if the deletion was successful (returned the deleted row)
    if !affectedRow.Next() {
        return fmt.Errorf("currency %v not found", curr.Symbol)
    }

    return nil
}
