using System;
using System.Net;
using AutoMapper;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace ConversaoMonetaria.Dominio.Core.Controllers;

public class ApiControllerBase : ControllerBase
{
    /// <summary>
    ///     Declaração do Mapper
    /// </summary>
    public readonly IMapper Mapper;

    /// <inheritdoc />
    public ApiControllerBase(IMapper mapper)
    {
        Mapper = mapper;
    }

    /// <summary>
    ///     Manuseia o Retorno. Valida se é necessário retornar erro ou o próprio TSucesso
    /// </summary>
    /// <typeparam name="TFalha"></typeparam>
    /// <typeparam name="TSucesso"></typeparam>
    /// <param name="Retorno">Objeto Retorno utilizado nas chamadas.</param>
    /// <returns></returns>
    public IActionResult HandleCommand<TFalha, TSucesso>(Retorno<TFalha, TSucesso> Retorno)
        where TFalha : Exception
    {
        return Retorno.EhFalha ? HandleFalha(Retorno.Failure) : Ok(Retorno.Result);
    }

    /// <summary>
    ///     Manuseia o Retorno. Valida se é necessário retornar erro ou o próprio TSucesso
    /// </summary>
    /// <typeparam name="TFalha"></typeparam>
    /// <typeparam name="TSucesso"></typeparam>
    /// <param name="Retorno">Objeto Retorno utilizado nas chamadas.</param>
    /// <returns></returns>
    public IActionResult HandleCommandCreated<TFalha, TSucesso>(Retorno<TFalha, TSucesso> Retorno)
        where TFalha : Exception
    {
        return Retorno.EhFalha ? HandleFalha(Retorno.Failure) : Created(string.Empty, Retorno.Result);
    }

    /// <summary>
    ///     Manuseia o Retorno. Valida se é necessário retornar erro ou o próprio TSucesso
    /// </summary>
    /// <typeparam name="TFalha"></typeparam>
    /// <typeparam name="TSucesso"></typeparam>
    /// <param name="Retorno">Objeto Retorno utilizado nas chamadas.</param>
    /// <returns></returns>
    public IActionResult HandleCommandNoContent<TFalha, TSucesso>(Retorno<TFalha, TSucesso> Retorno)
        where TFalha : Exception
    {
        return Retorno.EhFalha ? HandleFalha(Retorno.Failure) : NoContent();
    }

    /// <summary>
    ///     Verifica a exceção passada por parametro para passar o StatusCode correto para o frontend.
    /// </summary>
    /// <typeparam name="T">Qualquer classe que herde de Exception</typeparam>
    /// <param name="exceptionToHandle">obj de exceção</param>
    public IActionResult HandleFalha<T>(T exceptionToHandle) where T : Exception
    {
        if (exceptionToHandle is ValidationException)
            return StatusCode(HttpStatusCode.BadRequest.GetHashCode(),
                (exceptionToHandle as ValidationException).Errors);

        var exceptionPayload = PayloadException.New(exceptionToHandle);

        return exceptionToHandle is BussinessException
            ? StatusCode(exceptionPayload.ErrorCode, exceptionPayload)
            : StatusCode(HttpStatusCode.InternalServerError.GetHashCode(), exceptionPayload);
    }
}