using System.Threading.Tasks;
using AutoMapper;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;
using ConversaoMonetaria.Dominio.Core.Controllers;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConversaoMonetaria.Api.Controllers;

/// <inheritdoc />
public class MoedaController : ApiControllerBase
{
    private readonly IMoedaAppService _MoedaAppService;

    /// <inheritdoc />
    public MoedaController(IMoedaAppService MoedaAppService, IMapper mapper)
        : base(mapper)
    {
        _MoedaAppService = MoedaAppService;
    }

    /// <summary>
    ///     Médoto responsável por listar todas as Moedas cadastrada
    /// </summary>
    /// <returns>Lista de modelos com os dados da moeda</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(MoedaRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Moedas")]
    public async Task<IActionResult> Listar()
    {
        return HandleCommand(await _MoedaAppService.Listar());
    }

    /// <summary>
    ///     Médoto responsável pela obter uma Moeda
    /// </summary>
    /// <param name="idMoeda">Id da moeda no qual deseja obter</param>
    /// <returns>Modelo com os dados da moeda</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(MoedaRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Moedas/{idMoeda}")]
    public async Task<IActionResult> Consultar([FromRoute] long idMoeda)
    {
        return HandleCommand(await _MoedaAppService.Obter(idMoeda));
    }

    /// <summary>
    ///     Médoto responsável por atualizar uma Moeda
    /// </summary>
    /// <param name="moedaRequisicao">dados da moeda a ser adicionada</param>
    /// <param name="idMoeda">Id da moeda no qual deseja obter</param>
    [HttpPut]
    [Authorize]
    [ProducesResponseType(typeof(MoedaRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Moedas/{idMoeda}")]
    public async Task<IActionResult> Atualizar([FromRoute] long idMoeda,
        [FromBody] MoedaRequisicaoViewModel moedaRequisicao)
    {
        return HandleCommandNoContent(await _MoedaAppService.Atualizar(moedaRequisicao));
    }

    /// <summary>
    ///     Médoto responsável por Deletar uma Moeda
    /// </summary>
    /// <param name="idMoeda">Id da moeda no qual deseja obter</param>
    [HttpDelete]
    [Authorize]
    [ProducesResponseType(typeof(MoedaRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Moedas/{idMoeda}")]
    public async Task<IActionResult> Deletar([FromRoute] long idMoeda)
    {
        return HandleCommandNoContent(await _MoedaAppService.Deletar(idMoeda));
    }

    /// <summary>
    ///     Médoto responsável adicionar uma Moeda
    /// </summary>
    /// <param name="moedaRequisicao">dados da moeda a ser adicionada</param>
    /// <returns>Modelo com os dados da moeda adicionada</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(MoedaRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("Moedas")]
    public async Task<IActionResult> Salvar([FromBody] MoedaRequisicaoViewModel moedaRequisicao)
    {
        return HandleCommand(await _MoedaAppService.Salvar(moedaRequisicao));
    }
}