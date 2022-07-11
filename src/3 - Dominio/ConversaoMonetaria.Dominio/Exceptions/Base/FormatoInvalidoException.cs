using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Logging;

namespace ConversaoMonetaria.Dominio.Exceptions.Base;

public class FormatoInvalidoException : BussinessException
{
    public FormatoInvalidoException(int? messageCode, string message)
        : base(ErrorCodes.BadRequest, messageCode, message)
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