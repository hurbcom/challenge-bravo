package service

import (
	"encoding/json"
	"io"
	"runtime/debug"
	"sync"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/config"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/types"
	"gopkg.in/natefinch/lumberjack.v2"
)

type LogService struct {
	log zerolog.Logger
}

func (l *LogService) buildLog(event *zerolog.Event, m map[string]any) {
	for k, v := range m {
		switch v := v.(type) {
		case string:
			event.Str(k, v)
		case int:
			event.Int(k, v)
		case int8:
			event.Int8(k, v)
		case int16:
			event.Int16(k, v)
		case int32:
			event.Int32(k, v)
		case int64:
			event.Int64(k, v)
		case uint:
			event.Uint(k, v)
		case uint8:
			event.Uint8(k, v)
		case uint16:
			event.Uint16(k, v)
		case uint32:
			event.Uint32(k, v)
		case uint64:
			event.Uint64(k, v)
		case float32:
			event.Float32(k, v)
		case float64:
			event.Float64(k, v)
		case bool:
			event.Bool(k, v)
		case []byte:
			if json.Valid(v) {
				event.RawJSON(k, v)
			} else {
				event.Bytes(k, v)
			}
		default:
			event.Interface(k, v)
		}
	}
}

func (l *LogService) Info(logMessageIdentifier string, m map[string]any) {
	event := l.log.Info()

	l.buildLog(event, m)

	event.Msg(logMessageIdentifier)
}

var once sync.Once

var log zerolog.Logger

func NewLogService() types.ILogService {
	once.Do(func() {
		zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
		zerolog.TimeFieldFormat = time.RFC3339Nano

		var logWriter io.Writer = zerolog.ConsoleWriter{
			Out:        config.Envs.Log.Output,
			TimeFormat: time.RFC3339,
			FieldsExclude: []string{
				"git_revision",
			},
		}

		fileLogger := &lumberjack.Logger{
			Filename:   config.Envs.Log.Filename,
			MaxSize:    config.Envs.Log.MaxSize,
			MaxBackups: config.Envs.Log.MaxBackups,
			MaxAge:     config.Envs.Log.MaxAge,
			Compress:   config.Envs.Log.Compress,
		}

		output := zerolog.MultiLevelWriter(fileLogger, logWriter)

		buildInfo, _ := debug.ReadBuildInfo()

		log = zerolog.New(output).
			With().
			Timestamp().
			Str("go_version", buildInfo.GoVersion).
			Logger()
	})

	return &LogService{log: log}
}
