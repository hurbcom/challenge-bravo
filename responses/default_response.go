package responses

type DefaultResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
}
