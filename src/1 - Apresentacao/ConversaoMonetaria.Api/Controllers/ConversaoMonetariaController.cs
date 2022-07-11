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
    ///     Médoto responsável por converter valores entre moedas
    /// </summary>
    /// <param name="codigoMoedaDe">Codigo da moeda origem</param>
    /// <param name="codigoMoedaPara">Codigo da moeda destino</param>
    /// <param name="valor">Valor a ser converitdo</param>
    /// <returns>Valor convertido para a moeda solicitada</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("converter")]
    public IActionResult Converter(string codigoMoedaDe, string codigoMoedaPara, decimal valor)
    {
        return HandleCommand(_conversaoMonetariaService.Converter(codigoMoedaDe, codigoMoedaPara, valor));
    }
}