package errors

type BadRequestError struct {
	Message string
}

func (b *BadRequestError) Error() string {
	return b.Message
}
