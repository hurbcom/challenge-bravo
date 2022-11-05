package responses

func NewErrorMessageResponse(message string) MessageResponse {
	return MessageResponse{
		Message: message,
		Success: false,
	}
}

type MessageResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
}
