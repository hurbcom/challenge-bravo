package env

import (
	"embed"
	"errors"
	"fmt"
	"io"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

//go:embed testdata/*
var TestData embed.FS

func TestLoadForCoverage(t *testing.T) {
	_, _ = Load("")
	_, _ = Load("test")
}

func TestLoadFromFile(t *testing.T) {
	assert := assert.New(t)
	require := require.New(t)

	for index, tc := range []struct {
		fileName       string
		expectedErrStr string
	}{
		{"invalid @^~ file name", "open invalid @^~ file name: file does not exist"},
		{"testdata/empty_env", "env file is empty"},
		{"testdata/valid_env", ""},
	} {
		_, err := loadFromFile(tc.fileName, TestData)
		if tc.expectedErrStr != "" {
			require.Error(err, fmt.Sprintf("failed at test index %d", err))

			assert.Equal(err.Error(), tc.expectedErrStr, fmt.Sprintf("wrong error at test index %d\nwanted error: %s\nreceived error: %s", index, tc.expectedErrStr, err))
			continue
		}

		assert.NoError(err, fmt.Sprintf("didn't expect error at index %d", index))

	}
}

func TestParseFile(t *testing.T) {
	assert := assert.New(t)
	require := require.New(t)

	for index, tc := range []struct {
		file          io.Reader
		expectedData  Data
		expectedError error
	}{
		{nil, Data{}, errors.New("passed file is nil")},
		{strings.NewReader(""), Data{}, errors.New("env file is empty")},
		{strings.NewReader("x=123"), Data{}, errors.New("unknown key (x) in env file")},
		{strings.NewReader("postgres_host=      test\n\n\n\n"), Data{PQHost: "test"}, nil},
		{strings.NewReader("//comment\npostgres_host=foo"), Data{PQHost: "foo"}, nil},
		{strings.NewReader("test"), Data{}, errors.New("invalid line found in env file: test")},
		{strings.NewReader("webserver_timeout=a"), Data{}, errors.New("it was not possible to parse the timeout duration, err: time: invalid duration \"a\"")},
		{strings.NewReader("postgres_host=test\npostgres_user=user\npostgres_db=db\npostgres_password=123\n\nabstract_api_key=abc\nwebserver_timeout=30s\nwebserver_address=:80"), Data{PQHost: "test", PQUser: "user", PQDB: "db", PQPass: "123", AbstractAPIKey: "abc", WebserverTimeout: 30 * time.Second, WebserverAddress: ":80"}, nil},
	} {
		data, err := parseFile(tc.file)
		if tc.expectedError != nil {
			require.Error(err)
			assert.EqualValues(tc.expectedError.Error(), err.Error(), fmt.Sprintf("error at index %d\nExpected error: %s\nReceived error:%s", index, tc.expectedError, err))
		}

		assert.Equal(tc.expectedData, data, fmt.Sprintf("error at index %d\nExpected data: %#v\nReceived data:%#v", index, tc.expectedError, err))
	}
}
