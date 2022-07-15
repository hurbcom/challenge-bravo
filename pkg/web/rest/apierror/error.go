package apierror

// E is a struct that holds any error information in the API.
type E struct {
	Message string `json:"message"`
	RawErr  string `json:"raw_error,omitempty"`
	Code    code   `json:"code"`
} //@name Error

// WithMessage returns a new error that is a copy of the original
// error but with the Message field modified to msg.
func (e E) WithMessage(msg string) E {
	return E{
		Message: msg,
		RawErr:  e.RawErr,
		Code:    e.Code,
	}
}

// WithRawErr returna a new error that is a copy of the original
// error but with the RawErr field modified to be err.E().
//
// If err == nil, WithRawErr is a no-op.
func (e E) WithRawErr(err error) E {
	if err == nil {
		return e
	}

	return E{
		Message: e.Message,
		Code:    e.Code,
		RawErr:  err.Error(),
	}
}

// WithCode returns a new error that is a copy of the original
// error but with the Code field modified to be code.
func (e E) WithCode(code code) E {
	return E{
		Message: e.Message,
		RawErr:  e.RawErr,
		Code:    code,
	}
}

// Ptr returns a pointer to e.
func (e E) Ptr() *E {
	return &e
}
