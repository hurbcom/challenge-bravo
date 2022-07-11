using System;
using System.Text.Json.Serialization;
using ConversaoMonetaria.Dominio.Core.Http;

namespace ConversaoMonetaria.Dominio.Core.Exceptions;

public class PayloadException
{
    [JsonIgnore] public int ErrorCode { get; set; }

    public ExceptionReturnBase Resultado { get; set; }

    public static PayloadException New<T>(T exception) where T : Exception
    {
        var errorCode = exception is BussinessException
            ? (exception as BussinessException).ErrorCode.GetHashCode()
            : ErrorCodes.Unhandled.GetHashCode();

        return new PayloadException
        {
            ErrorCode = errorCode,
            Resultado = new ExceptionReturnBase
            {
                CodigoMensagem = (exception as BussinessException)?.MessageCode ?? 0,
                Mensagem = (exception as BussinessException)?.Message
            }
        };
    }
}