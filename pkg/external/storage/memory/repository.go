package memory

import "time"

type ErrNotFound struct {
	ID string
}

func (err *ErrNotFound) Error() string {
	return "not found"
}

type Storage struct {
	boletos map[string]Boleto
}

func NewStorage() *Storage {
	firstBoletoIssueDate := time.Now()
	firstBoletoDueDate := firstBoletoIssueDate.Add(time.Hour * 48)

	firstBoleto := Boleto{
		Identifier:  "1",
		Segment:     "NORMAL",
		Description: "",
		Issuer: BoletoIssuer{
			Name:        "NETFLIX ENTRETENIMENTO BRASIL LTDA",
			FantasyName: "NETFLIX ENTRETENIMENTO BRASIL LTDA",
			LogoURL:     "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
			Activity:    "Entretenimento",
			Bank: BoletoIssuerBank{
				BankNumber:  "237",
				FantasyName: "Banco Bradesco S.A.",
			},
			Address: "2764  Farland Avenue, Laredo - TX, Texas",
			Register: BoletoIssuerRegister{
				Type:  "CNPJ",
				Value: "13590585000199",
			},
		},
		Payer: BoletoPayer{
			Name: "Guilherme Paixão",
			Register: BoletoPayerRegister{
				Type:  "CPF",
				Value: "67572314090",
			},
		},
		Reason:    "Premium ULTRA HD",
		IssueDate: firstBoletoIssueDate,
		DueDate:   firstBoletoDueDate,
		Interest:  0,
		Mulct: BoletoMulct{
			Currency: "BRL",
			Value:    0,
		},
		Cost: BoletoCost{
			Currency: "BRL",
			Value:    10000,
		},
		BarCode:               "123900000500000000060000000007856760000015075",
		Paid:                  true,
		OriginalURL:           "",
		AutomaticDebitApplied: false,
		Receipt: BoletoReceipt{
			PaymentDate: firstBoletoDueDate.Add(-(time.Hour * 24)),
			Bank:        "237",
			Value:       10000,
		},
	}

	secondBoletoIssueDate := firstBoleto.IssueDate.Add(time.Hour * 96)
	secondBoletoDueDate := secondBoletoIssueDate.Add(time.Hour * 48)

	secondBoleto := Boleto{
		Identifier:  "2",
		Segment:     "NORMAL",
		Description: "",
		Issuer: BoletoIssuer{
			Name:        "NETFLIX ENTRETENIMENTO BRASIL LTDA",
			FantasyName: "NETFLIX ENTRETENIMENTO BRASIL LTDA",
			LogoURL:     "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
			Activity:    "Entretenimento",
			Bank: BoletoIssuerBank{
				BankNumber:  "237",
				FantasyName: "Banco Bradesco S.A.",
			},
			Address: "2764  Farland Avenue, Laredo - TX, Texas",
			Register: BoletoIssuerRegister{
				Type:  "CNPJ",
				Value: "13590585000199",
			},
		},
		Payer:     BoletoPayer{},
		Reason:    "Premium ULTRA HD",
		IssueDate: secondBoletoIssueDate,
		DueDate:   secondBoletoDueDate,
		Interest:  0,
		Mulct: BoletoMulct{
			Currency: "BRL",
			Value:    0,
		},
		Cost: BoletoCost{
			Currency: "BRL",
			Value:    12000,
		},
		BarCode:               "163900000800000000060000000007856760000015076",
		Paid:                  false,
		OriginalURL:           "",
		AutomaticDebitApplied: false,
	}

	boletos := map[string]Boleto{
		firstBoleto.Identifier:  firstBoleto,
		secondBoleto.Identifier: secondBoleto,
	}

	return &Storage{boletos: boletos}
}
