package testutils

import (
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/db"
)

func afterEach() {
	db.CloseTestTx()
}
