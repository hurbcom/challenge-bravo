package errors

type ClientFailed struct {
	Message string
}

func (c *ClientFailed) Error() string {
	return c.Message
}
