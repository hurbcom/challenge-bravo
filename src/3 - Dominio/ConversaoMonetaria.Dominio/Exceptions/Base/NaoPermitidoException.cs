using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Logging;

namespace ConversaoMonetaria.Dominio.Exceptions.Base;

public class NaoPermitidoException : BussinessException
{
    public NaoPermitidoException(int messageCode, string message)
        : base(ErrorCodes.Forbidden, messageCode, message)
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