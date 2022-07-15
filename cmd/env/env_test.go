package env

import (
	"embed"
	"fmt"
	"io"
	"os"
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

	for index, tc := range []struct {
		fileName    string
		shouldError bool
	}{
		{"invalid @^~ file name", true},
		{"testdata/empty_env", true},
		{"testdata/valid_env", false},
	} {
		_, err := loadFromFile(tc.fileName, TestData)
		if tc.shouldError {
			assert.Error(err, fmt.Sprintf("error at index %d", index))
		} else {
			assert.NoError(err, fmt.Sprintf("error at index %d", index))
		}
	}
}

func TestParseFile(t *testing.T) {
	assert := assert.New(t)

	for index, tc := range []struct {
		file        io.Reader
		wantData    Data
		shouldError bool
	}{
		{nil, Data{}, true},
		{strings.NewReader(""), Data{}, true},
		{strings.NewReader("x=123"), Data{}, true},
		{strings.NewReader("postgres_host=      test\n\n\n\n"), Data{PQHost: "test"}, false},
		{strings.NewReader("//comment\npostgres_host=foo"), Data{PQHost: "foo"}, false},
		{strings.NewReader("test"), Data{}, true},
		{strings.NewReader("webserver_timeout=a"), Data{}, true},
		{strings.NewReader("postgres_host=test\npostgres_user=user\npostgres_db=db\npostgres_password=123\n\nabstract_api_key=abc\nwebserver_timeout=30s\nwebserver_address=:80"), Data{PQHost: "test", PQUser: "user", PQDB: "db", PQPass: "123", AbstractAPIKey: "abc", WebserverTimeout: 30 * time.Second, WebserverAddress: ":80"}, false},
	} {
		data, err := parseFile(tc.file)
		if tc.shouldError {
			assert.Error(err, fmt.Sprintf("error at index %d", index))
		} else {
			assert.NoError(err, fmt.Sprintf("error at index %d", index))
		}

		assert.Equal(tc.wantData, data, fmt.Sprintf("error at index %d\nExpected data: %#v\nReceived data:%#v", index, tc.wantData, data))
	}
}

func TestLoadFromEnvVars(t *testing.T) {
	assert := assert.New(t)
	require := require.New(t)

	envVars := []string{"POSTGRES_HOST", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB",
		"ABSTRACT_API_KEY",
		"WEBSERVER_TIMEOUT", "WEBSERVER_ADDRESS"}

	for index, tc := range []struct {
		wantData    Data
		shouldError bool
		f           func() error
	}{
		{
			Data{WebserverTimeout: 30 * time.Second}, false,
			func() error {
				return os.Setenv("WEBSERVER_TIMEOUT", "30s")
			},
		},
		{
			Data{}, true,
			func() error {
				return os.Setenv("WEBSERVER_TIMEOUT", "invalid duration")
			},
		},
	} {
		for _, env := range envVars {
			require.Nil(os.Setenv(env, ""))
		}

		require.NoError(tc.f())

		data, err := loadFromEnvVars()
		if tc.shouldError {
			assert.Error(err, fmt.Sprintf("error at index %d", index))
		} else {
			assert.NoError(err, fmt.Sprintf("error at index %d", index))
		}

		assert.Equal(tc.wantData, data, fmt.Sprintf("error at index %d\nExpected data: %#v\nReceived data:%#v", index, tc.wantData, data))
	}
}
