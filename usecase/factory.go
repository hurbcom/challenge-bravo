package usecase

const (
	BANK_CURRENCY_CODE_ENV_VAR = "BANK_CURRENCY_CODE"
)

type (
	UsecaseError struct {
		Message string
	}
)

func (u UsecaseError) Error() string {
	//TODO implement me
	panic("implement me")
}
