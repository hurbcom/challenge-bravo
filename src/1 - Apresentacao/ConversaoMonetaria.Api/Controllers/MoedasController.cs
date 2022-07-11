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
public class MoedasController : ApiControllerBase
{
    private readonly IMoedaAppService _moedaAppService;

    /// <inheritdoc />
    public MoedasController(IMoedaAppService MoedaAppService, IMapper mapper)
        : base(mapper)
    {
        _moedaAppService = MoedaAppService;
    }

    /// <summary>
    ///     Médoto responsável por listar todas as Moedas cadastrada
    /// </summary>
    /// <returns>Lista de modelos com os dados da moeda</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(MoedaListarRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [Route("moedas")]
    public async Task<IActionResult> Listar()
    {
        return HandleCommand(await _moedaAppService.Listar());
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
    [Route("moedas/{idMoeda}")]
    public async Task<IActionResult> Buscar([FromRoute] long idMoeda)
    {
        return HandleCommand(await _moedaAppService.Obter(idMoeda));
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
    [Route("moedas/{idMoeda}")]
    public async Task<IActionResult> Atualizar([FromRoute] long idMoeda,
        [FromBody] MoedaRequisicaoViewModel moedaRequisicao)
    {
        return HandleCommandNoContent(await _moedaAppService.Atualizar(idMoeda, moedaRequisicao));
    }

    /// <summary>
    ///     Médoto responsável por Deletar uma Moeda
    /// </summary>
    /// <param name="idMoeda">Id da moeda no qual deseja obter</param>
    [HttpDelete]
    [Authorize]
    [ProducesResponseType(typeof(NoContentResult), 204)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(NotFoundException), 404)]
    [Route("moedas/{idMoeda}")]
    public async Task<IActionResult> Deletar([FromRoute] long idMoeda)
    {
        return HandleCommandNoContent(await _moedaAppService.Deletar(idMoeda));
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
    [Route("moedas")]
    public async Task<IActionResult> Salvar([FromBody] MoedaRequisicaoViewModel moedaRequisicao)
    {
        return HandleCommandCreated(await _moedaAppService.Salvar(moedaRequisicao));
    }
}