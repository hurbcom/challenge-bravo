using AutoMapper;
using ConversaoMonetaria.Dominio.Core.Controllers;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace ConversaoMonetaria.Api.Controllers;

/// <inheritdoc />
public class ConversaoMonetariaController : ApiControllerBase
{
    private readonly ConversaoMonetariaService _conversaoMonetariaService;

    /// <inheritdoc />
    public ConversaoMonetariaController(IMapper mapper, ConversaoMonetariaService conversaoMonetariaService)
        : base(mapper)
    {
        _conversaoMonetariaService = conversaoMonetariaService;
    }

    /// <summary>
    ///     Médoto responsável pela obter uma ConversaoMonetaria
    /// </summary>
    /// <param name="idConversaoMonetaria">Id da ConversaoMonetaria no qual deseja obter</param>
    /// <returns>Modelo com os dados da ConversaoMonetaria</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Converter")]
    public IActionResult Converter(string codigoMoedaDe, string codigoMoedaPara, decimal valor)
    {
        return HandleCommand(_conversaoMonetariaService.Converter(codigoMoedaDe, codigoMoedaPara, valor));
    }
}