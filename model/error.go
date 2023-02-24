package model

type Error struct {
	// Código do Erro
	// required: true
	Code float32 `json:"code"`
	// Descrição do Erro
	// required: true
	Message string `json:"message"`
}

// Retorna as informações do erro
// swagger:response errorResponse
type errorResponseWrapper struct {
	// Informações do Erro
	// in: body
	Body struct {
		Error
	}
}
