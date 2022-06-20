package action

import (
	"context"
	"github.com/joaohgf/challenge-bravo/internal/repository"
	"github.com/joho/godotenv"
	"testing"
)

func init() {
	err := godotenv.Load("../../test/test.env")
	if err != nil {
		panic(err)
	}
}

func TestUpdate_Act(t *testing.T) {
	var ctx = context.Background()
	var repo = repository.NewEngine(ctx)
	var actionUpdate = NewUpdate(repo)
	actionUpdate.Act(ctx)
	if len(actionUpdate.errors.err) > 0 {
		t.Errorf("Update.Act() error = %v", actionUpdate.errors.err)
		t.Fail()
	}
}
