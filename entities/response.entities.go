package entities

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type AppError struct {
	Err        error
	StatusCode int
}

func (appError *AppError) Error() string {
	return appError.Err.Error()
}

type AppResult struct {
	Data       interface{}
	Err        error
	StatusCode int
}
