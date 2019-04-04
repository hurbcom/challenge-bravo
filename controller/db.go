package controller

import (
	"github.com/hurbcom/challenge-bravo/config"
	db "github.com/hurbcom/challenge-bravo/db"
)

type DBController struct {
	Database db.Database
}

//GetCurrentRates gets the current rates from database
func (d *DBController) GetCurrentRates(symbols []string) (map[string]float64, error) {
	query := []interface{}{config.Config["DB_HASH"]}

	for _, value := range symbols {
		query = append(query, value)
	}
	response, err := d.Database.HMGet(query)
	if err != nil {
		return nil, err
	}
	correlation := make(map[string]float64)
	for i, value := range response {
		correlation[symbols[i]] = value
	}
	return correlation, nil

}

//SetRates sets some currency rates in the database
func (d *DBController) SetRates(values map[string]float64) error {
	query := []interface{}{config.Config["DB_HASH"]}
	for key, value := range values {
		query = append(query, []interface{}{key, value}...)
	}
	return d.Database.HMSet(query)
}
