using System;
using ConversaoMonetaria.Dominio.Core.Http;

namespace ConversaoMonetaria.Dominio.Core.Exceptions;

public class InfraException : Exception
{
    public InfraException(ErrorCodes errorCode, string message)
        : base(message)
    {
        ErrorCode = errorCode;
    }

    public ErrorCodes ErrorCode { get; }
}