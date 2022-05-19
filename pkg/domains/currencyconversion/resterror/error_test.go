package resterror

import (
	"database/sql"
	"fmt"
	"net/http"
	"testing"

	"github.com/pkg/errors"
	"github.com/stretchr/testify/assert"
)

func Test_restError_ErrorProcess(t *testing.T) {
	type args struct {
		err error
	}
	tests := []struct {
		name     string
		re       restError
		args     args
		want     string
		wantCode int
	}{
		{
			name:     "success, error found",
			re:       restError{sql.ErrNoRows: {"record not found", http.StatusNotFound}},
			args:     args{err: sql.ErrNoRows},
			want:     "record not found",
			wantCode: http.StatusNotFound,
		},
		{
			name:     "success, error which is wrapped before must be found",
			re:       restError{sql.ErrNoRows: {"record not found", http.StatusNotFound}},
			args:     args{err: errors.Wrap(sql.ErrNoRows, "missing record")},
			want:     "record not found",
			wantCode: http.StatusNotFound,
		},
		{
			name:     "success, error which is wrapped (stdlib) before must be found",
			re:       restError{sql.ErrNoRows: {"record not found", http.StatusNotFound}},
			args:     args{err: fmt.Errorf("missing record: %w", sql.ErrNoRows)},
			want:     "record not found",
			wantCode: http.StatusNotFound,
		},
		{
			name: "fail, error isn't mapped and cannot be found",
			re:   restError{},
			args: args{err: sql.ErrNoRows},
			// we don't use const here to force checking in case of change
			want:     "Sorry, something went wrong",
			wantCode: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, code := tt.re.ErrorProcess(tt.args.err)
			assert.Equal(t, tt.want, got)
			assert.Equal(t, tt.wantCode, code)
		})
	}
}
