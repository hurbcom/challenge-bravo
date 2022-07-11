using System;
using Serilog;

namespace ConversaoMonetaria.Dominio.Logging;

public class LoggingCommand
{
    public static void LogInformacao(string aplicacao, string mensagem, string @base)
    {
        try
        {
            Log.Logger.Information("{Mensagem} {Servico} {Tipo} {Base}", mensagem, aplicacao, "Notificação", @base);
        }
        catch
        {
            // ignored
        }
    }

    public static void LogErro(string aplicacao, string mensagem, string @base)
    {
        try
        {
            Log.Logger.Error("{Mensagem} {Servico} {Tipo} {Base}", mensagem, aplicacao, "Notificação", @base);
        }
        catch
        {
            // ignored
        }
    }

    public static void LogErro(string aplicacao, Exception exception, string mensagem, string @base)
    {
        try
        {
            Log.Logger.Error(exception, "{Mensagem} {Servico} {Tipo} {Base}", mensagem, aplicacao, "Notificação",
                @base);
        }
        catch
        {
            // ignored
        }
    }
}