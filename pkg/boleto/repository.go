package boleto

type Repository interface {
	RetrieveBoletos() ([]Boleto, error)
	GetBoleto(id string) (*Boleto, error)
}
