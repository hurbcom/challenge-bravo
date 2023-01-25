package services

import (
	"testing"
)

func TestCron(t *testing.T) {
	repositoryMock := RepositoryMock{}

	//teste Error Api URL
	err := CronUpdateCurrenciesFromApi(&repositoryMock)
	if err == nil {
		t.Error(err)
	}

	//teste SUCCESS Api URL
	t.Setenv("API_CRYPTOCOMPARE", "https://min-api.cryptocompare.com/data/")

	err = CronUpdateCurrenciesFromApi(&repositoryMock)
	if err != nil {
		t.Error(err)
	}
}
