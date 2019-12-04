package model

//DefaultResponse ... Variável utilizada para responstas das API
type DefaultResponse struct {
	Success bool        `json:"success"`
	Error   string      `json:"error"`
	Data    interface{} `json:"data"`
}
