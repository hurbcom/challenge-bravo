package boleto

type Service interface {
	RetriveBoletos() ([]Boleto, error)
	GetBoleto(id string) (*Boleto, error)
}

type defaultService struct {
	repository Repository
}

func (s *defaultService) RetriveBoletos() ([]Boleto, error) {
	return s.repository.RetrieveBoletos()
}

func (s *defaultService) GetBoleto(id string) (*Boleto, error) {
	return s.repository.GetBoleto(id)
}

func NewService(r Repository) *defaultService {
	return &defaultService{repository: r}
}
