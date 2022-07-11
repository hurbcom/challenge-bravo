using AutoMapper;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Controllers;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace ConversaoMonetaria.Api.Controllers;

/// <inheritdoc />
public class AutenticacaoController : ApiControllerBase
{
    private readonly IAutenticacaoAppService _autenticacaoAppService;

    /// <inheritdoc />
    public AutenticacaoController(IAutenticacaoAppService autenticacaoAppService, IMapper mapper)
        : base(mapper)
    {
        _autenticacaoAppService = autenticacaoAppService;
    }

    /// <summary>
    ///     Retorna a Autenticação Bearer
    /// </summary>
    /// <param name="model">
    ///     Dados da Requisição
    ///     <br />
    ///     <li><b>Usuario: </b> Usuário (usar admin)</li>
    ///     <li><b>Senha: </b> Senha (usar admin)</li>
    /// </param>
    /// <returns>Token de autenticação e data de expiração</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AutenticacaoRespostaViewModel), 200)]
    [ProducesResponseType(typeof(PayloadException), 400)]
    [ProducesResponseType(typeof(UnauthorizedException), 401)]
    [ProducesResponseType(typeof(ForbidException), 403)]
    [Route("autenticacoes")]
    public IActionResult Autenticar([FromBody] AutenticacaoViewModel model)
    {
        return HandleCommand(_autenticacaoAppService.Autenticar(model));
    }
}