package db

import (
	"context"
	"log"
)

func CloseTestTx() {
	if testTx != nil {
		if err := testTx.Rollback(context.TODO()); err != nil && err.Error() != "tx is closed" {
			log.Fatalf("error on closing transaction in test environment: %v", err)
		}
		testTx = nil
	}
}
