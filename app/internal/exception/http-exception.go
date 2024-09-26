package exception

type HttpException struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *HttpException) Error() string {
	return e.Message
}
