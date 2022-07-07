using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Logging;

namespace ConversaoMonetaria.Dominio.Exceptions.Base;

public class ErroServidorException : BussinessException
{
    public ErroServidorException(int messageCode, string message)
        : base(ErrorCodes.Unhandled, messageCode, message)
    {
        try
        {
            LoggingCommand.LogErro("ConversaoMonetariaAPI", message, "API");
        }
        catch (Exception)
        {
            // ignored
        }
    }
}