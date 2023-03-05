package errors

type UnprocessableError struct {
	Message string
}

func (u *UnprocessableError) Error() string {
	return u.Message
}
