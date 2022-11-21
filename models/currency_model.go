package models

import (
	"github.com/Ricardo-Sales/challenge-bravo/database"
)

type Currency struct {
	ID    uint32  `json:"id"`
	Name  string  `json:"name"`
	ToUsd float64 `json:"tousd"`
}

func GetAll() ([]Currency, error) {

	var crs []Currency
	var err error

	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("select id, name, tousd from currency")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var currency Currency
		if err = rows.Scan(&currency.ID, &currency.Name, &currency.ToUsd); err != nil {
			return nil, err
		}
		crs = append(crs, currency)
	}

	return crs, err
}

func (cr *Currency) Save() error {

	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	statement, err := db.Prepare("insert into currency (name, tousd) values(?,?)")
	if err != nil {
		return err
	}
	insert, err := statement.Exec(cr.Name, cr.ID)
	if err != nil {
		return err
	}
	ID, err := insert.LastInsertId()
	if err != nil {
		return err
	}
	cr.ID = uint32(ID)

	return nil
}

func (cr *Currency) GetOne() error {

	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	rows, err := db.Query("select name, tousd from currency where id = ?", cr.ID)
	if err != nil {
		return err
	}

	if rows.Next() {
		if err = rows.Scan(&cr.Name, &cr.ToUsd); err != nil {
			return err
		}
	}

	return nil
}

func (cr *Currency) Update() error {

	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	statement, err := db.Prepare("update currency set name=?, tousd = ? where id = ?")
	if err != nil {
		return err
	}
	if _, err = statement.Exec(cr.Name, cr.ToUsd); err != nil {
		return err
	}

	return nil
}

func (cr *Currency) Delete() error {

	db, err := database.Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	statement, err := db.Prepare("delete from currency where id = ?")
	if err != nil {
		return err
	}

	if _, err = statement.Exec(cr.ID); err != nil {
		return err
	}
	return nil
}
