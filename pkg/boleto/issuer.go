package boleto

type (
	IssuerRegister struct {
		Type  string
		Value string
	}

	IssuerBank struct {
		BankNumber  string
		FantasyName string
	}

	Issuer struct {
		Name        string
		FantasyName string
		LogoURL     string
		Activity    string
		Bank        IssuerBank
		Address     string
		Register    IssuerRegister
	}
)
