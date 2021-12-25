package dao

import (
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	entranslations "github.com/go-playground/validator/v10/translations/en"
	"log"
)

// Validator object
var Validator *validator.Validate

// Translator Validation messages
var Translator ut.Translator

// initValidator Initialize validation engine
func initValidator() error {

	// Creates the validator
	Validator = validator.New()

	// Creates validation messages
	eng := en.New()
	uni := ut.New(eng, eng)
	Translator, _ = uni.GetTranslator("en")
	if err := entranslations.RegisterDefaultTranslations(Validator, Translator); err != nil {
		log.Println(err)
		return err
	}
	return nil
}
