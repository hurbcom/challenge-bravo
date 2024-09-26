package db

import (
	"context"
	"log"

	"github.com/wesleyfebarretos/challenge-bravo/app/internal/config"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
)

func GetConnection() DBConn {
	if config.Envs.AppEnv == enum.TEST_ENVIROMENT {
		if testTx != nil {
			return testTx
		}

		tx, err := conn.Begin(context.TODO())
		if err != nil {
			log.Fatalf("error on opening transaction to test environment: %v", err)
		}

		testTx = tx

		return testTx
	}

	return conn
}
