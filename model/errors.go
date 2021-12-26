package model

import "strings"

// Error Custom error that handle error lists
type Error struct {
	Message    string   `json:"message"`
	Errors     []string `json:"errors,omitempty"`
	StatusCode int      `json:"-"`
}

// Append an error to the list
func (err *Error) Append(str string) {
	err.Errors = append(err.Errors, str)
}

// Error Print the error message
func (err *Error) Error() string {
	var msg []string
	if len(err.Message) > 0 {
		msg = append(msg, err.Message)
	}
	msg = append(msg, err.Errors...)
	return strings.Join(msg, "\n")
}

// NewMultipleErrors Creates a new NewMultipleErrors with message and details
func NewMultipleErrors(message string, err error) Error {

	// Create error response object
	er := Error{
		Message: message,
		Errors:  make([]string, 1),
	}
	er.Errors[0] = err.Error()
	return er
}
