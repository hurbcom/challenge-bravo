using System;
using AutoMapper;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.JwtSecurity;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Entidades.Autenticacao;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;

namespace ConversaoMonetaria.Aplicacao.AppServices;

public class AutenticacaoAppService : IAutenticacaoAppService
{
    private readonly IAutenticacaoRepositorio _autenticacaoRepositorio;
    private readonly ExpiracaoAutenticacao _expiracaoAutenticacao;
    private readonly IMapper _mapper;

    public AutenticacaoAppService(IMapper mapper, IAutenticacaoRepositorio autenticacaoService,
        ExpiracaoAutenticacao expiracaoAutenticacao)
    {
        _mapper = mapper;
        _autenticacaoRepositorio = autenticacaoService;
        _expiracaoAutenticacao = expiracaoAutenticacao;
    }

    public Retorno<BussinessException, AutenticacaoRespostaViewModel> Autenticar(AutenticacaoViewModel model)
    {
        var autenticacao = _mapper.Map<Autenticacao>(model);

        var resultadoAutenticacao = _autenticacaoRepositorio.Autenticar(autenticacao);

        if (resultadoAutenticacao.EhFalha)
            return resultadoAutenticacao.Failure;

        var autenticacaoRespostaViewModel = _mapper.Map<AutenticacaoRespostaViewModel>(resultadoAutenticacao.Result);
        autenticacaoRespostaViewModel.DataExpiracao =
            DateTime.Now.AddMinutes(_expiracaoAutenticacao.TempoExpiracaoAutenticacaoMinutos).FormatDateTimeBrazil();
        autenticacaoRespostaViewModel.Token = SecurityToken.Generate(autenticacao.GuidJwt.ToString(),
            _expiracaoAutenticacao.TempoExpiracaoAutenticacaoMinutos);

        return autenticacaoRespostaViewModel;
    }
}