using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Core.Handle;

public static class FalhaHandle
{
    public static (int, List<string>) Handle<T>(T exceptionToHandle) where T : Exception
    {
        if (exceptionToHandle is ValidationException exception)
            return (HttpStatusCode.BadRequest.GetHashCode(),
                exception.Errors.Select(p => $"{p.ErrorCode} - {p.ErrorMessage}").ToList());

        var exceptionPayload = PayloadException.New(exceptionToHandle);

        var erros = new List<string>();
        erros.Add($"{exceptionPayload.Resultado.CodigoMensagem} - {exceptionPayload.Resultado.Mensagem}");

        return exceptionToHandle is BussinessException
            ? (exceptionPayload.ErrorCode, erros)
            : (HttpStatusCode.InternalServerError.GetHashCode(), erros);
    }
}