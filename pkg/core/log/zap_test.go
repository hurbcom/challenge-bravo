package log

import (
	"context"
	"reflect"
	"testing"

	"challenge-bravo/pkg/core/telemetry"

	"go.uber.org/zap"
)

func Test_fieldsToZap(t *testing.T) {
	type args struct {
		ctx    context.Context
		tracer telemetry.Tracer
		fs     []Field
	}
	tests := []struct {
		name string
		args args
		want []zap.Field
	}{
		{
			name: "simple",
			args: args{
				ctx:    context.Background(),
				tracer: nil,
				fs: []Field{
					{
						Key:   "foo",
						Value: "boo",
					},
				},
			},
			want: func() []zap.Field {
				zapFields := make([]zap.Field, 1)
				zapFields[0] = zap.Any("foo", "boo")

				return zapFields
			}(),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := fieldsToZap(tt.args.ctx, tt.args.tracer, tt.args.fs); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("fieldsToZap() = %v, want %v", got, tt.want)
			}
		})
	}
}
