package responses

func NewMessageResponse(message string) MessageResponse {
	return MessageResponse{
		Message: message,
	}
}

type MessageResponse struct {
	Message string `json:"message"`
}
