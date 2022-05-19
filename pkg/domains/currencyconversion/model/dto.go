package model

func (q CurrencyConversion) ToJSONResponse() JSONResponse {
	resp := JSONResponse{
		Converted: true,
		Value:     q.ConvertedValue,
		ConvertRequest: ConvertRequest{
			From:   q.From,
			To:     q.To,
			Amount: q.Amount,
		},
	}

	if q.Error != nil {
		resp.Converted = false
		resp.Error = q.Error.Error()
	}

	return resp
}
