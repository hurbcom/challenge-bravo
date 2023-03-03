package http

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type ValidationError struct {
	Field string `json:"field"`
	Error string `json:"error"`
}

func FormatValidateErrorMessage(validationError error) []ValidationError {
	var errors []ValidationError
	for _, err := range validationError.(validator.ValidationErrors) {
		errors = append(errors, ValidationError{
			Field: err.Field(),
			Error: fmt.Sprintf("Field %s rules: %s", err.Field(), err.Tag()),
		})
	}

	return errors
}
