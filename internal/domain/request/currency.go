package request

import "github.com/ElladanTasartir/challenge-bravo/internal/domain/entity"

type RequestHandler interface {
	GetCurrency(name string) (*entity.Currency, error)
}
