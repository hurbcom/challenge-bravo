package env

import (
	"context"
	"log"
	"os"
	"reflect"
	"strings"
	"testing"
	"time"
)

func TestLoadEnv(t *testing.T) {
	type config struct {
		Addr    string        `env:"BIND,required"`
		Timeout time.Duration `env:"TIMEOUT,default=10s"`
	}
	type args struct {
		ctx      context.Context
		dst      interface{}
		prefix   string
		mutators []MutatorFunc
	}
	tests := []struct {
		name    string
		args    args
		setup   func()
		want    *config
		wantErr bool
	}{
		{
			name: "success, test default",
			args: args{
				ctx:    context.Background(),
				dst:    &config{},
				prefix: "HTTP_",
			},
			want: &config{
				Addr:    "0.0.0.0:8080",
				Timeout: 10 * time.Second,
			},
			setup: func() {
				if err := os.Setenv("HTTP_BIND", "0.0.0.0:8080"); err != nil {
					log.Fatal(err)
				}
			},
			wantErr: false,
		},
		{
			name: "success, mutator",
			args: args{
				ctx:    context.Background(),
				dst:    &config{},
				prefix: "HTTP_",
				// mutator to not forget to include ":" in bind addr
				mutators: []MutatorFunc{func(ctx context.Context, k, v string) (string, error) {
					if k != "BIND" {
						return v, nil
					}
					if !strings.Contains(v, ":") {
						v = ":" + v
					}

					return v, nil
				}},
			},
			want: &config{
				Addr:    ":8080",
				Timeout: 10 * time.Second,
			},
			setup: func() {
				if err := os.Setenv("HTTP_BIND", "8080"); err != nil {
					log.Fatal(err)
				}
			},
			wantErr: false,
		},
		{
			name: "success, change default env",
			args: args{
				ctx:    context.Background(),
				dst:    &config{},
				prefix: "HTTP_",
			},
			want: &config{
				Addr:    ":8080",
				Timeout: 60 * time.Second,
			},
			setup: func() {
				if err := os.Setenv("HTTP_BIND", ":8080"); err != nil {
					log.Fatal(err)
				}
				if err := os.Setenv("HTTP_TIMEOUT", "60s"); err != nil {
					log.Fatal(err)
				}
			},
			wantErr: false,
		},
		{
			name: "success, change env and no prefix",
			args: args{
				ctx:    context.Background(),
				dst:    &config{},
				prefix: "",
			},
			want: &config{
				Addr:    ":8080",
				Timeout: 10 * time.Second,
			},
			setup: func() {
				if err := os.Setenv("BIND", ":8080"); err != nil {
					log.Fatal(err)
				}
			},
			wantErr: false,
		},
		{
			name: "fail, missing required env",
			args: args{
				ctx:    context.Background(),
				dst:    &config{},
				prefix: "NOTFOUND",
			},
			want:    &config{},
			setup:   func() {},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup()
			if err := LoadEnv(tt.args.ctx, tt.args.dst, tt.args.prefix, tt.args.mutators...); (err != nil) != tt.wantErr {
				t.Errorf("LoadEnv() error = %v, wantErr %v", err, tt.wantErr)
			}
			if !reflect.DeepEqual(tt.want, tt.args.dst) {
				t.Errorf("LoadEnv() = %v, want %v", tt.args.dst, tt.want)
			}
		})
	}
}
