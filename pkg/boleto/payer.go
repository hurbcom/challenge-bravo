package boleto

type PayerRegister struct {
	Type  string
	Value string
}

type Payer struct {
	Name     string
	Register PayerRegister
}
