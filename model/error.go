package model

type Error struct {
	Code    float32 `json:"code"`
	Message string  `json:"message"`
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

// Criado com sucesso. (Não retorna nenhum conteúdo)
// swagger:response noContentResponse
type noContentResponseWrapper struct{}

// swagger:parameters Obter Alterar Deletar
type IDParameterWrapper struct {
	// Identificador
	// in: path
	// required: true
	ID int `json:"id"`
}
