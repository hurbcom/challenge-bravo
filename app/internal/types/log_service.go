package types

type ILogService interface {
	Info(string, map[string]any)
}
