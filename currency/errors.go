package currency

import "github.com/pkg/errors"

var ErrFailedToConnectToServer = errors.New("failed to connect to server")
var ErrDecodeBody = errors.New("error reading received body from server")
var ErrCurrencyNotExist = errors.New("currency does not exist")
