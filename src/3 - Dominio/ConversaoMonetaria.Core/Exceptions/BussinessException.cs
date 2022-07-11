using System;
using ConversaoMonetaria.Dominio.Core.Http;

namespace ConversaoMonetaria.Dominio.Core.Exceptions;

public class BussinessException : Exception
{
    public BussinessException(ErrorCodes errorCode, int? messageCode, string message) : base(message)
    {
        ErrorCode = errorCode;
        MessageCode = messageCode ?? 0;
    }

    public ErrorCodes ErrorCode { get; }
    public int MessageCode { get; set; }
}