package action

import (
	"context"
	"fmt"
	"github.com/joaohgf/challenge-bravo/internal/repository"
)

// Errors struct for errors
type Errors struct {
	repository *repository.Engine
	err        map[string]interface{}
}

// NewErrors creates a new errors
func NewErrors(repository *repository.Engine) *Errors {
	return &Errors{repository: repository, err: make(map[string]interface{}, 0)}
}

// Save errors in the repository if be necessary
func (e *Errors) Save(ctx context.Context) {
	e.repository.Mongo.SetCollection("errors")
	var errorsToSave = make(map[string]interface{})
	_, createErr := e.repository.Mongo.Create(ctx, e.err)
	if createErr != nil {
		panic(fmt.Errorf("error creating error: %s", createErr.Error()))
		return
	}
	if len(errorsToSave) > 0 {
		panic(errorsToSave)
	}
}
