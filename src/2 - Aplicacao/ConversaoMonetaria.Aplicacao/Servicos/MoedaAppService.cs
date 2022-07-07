using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Entidades.Moedas;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using ConversaoMonetaria.Dominio.Interfaces.Repository;

namespace ConversaoMonetaria.Aplicacao.Servicos;

public class MoedaAppService : IMoedaAppService
{
    private readonly IMapper _mapper;
    private readonly IMoedaRepositorio _MoedaRepositorio;

    public MoedaAppService(IMapper mapper, IMoedaRepositorio MoedaService)
    {
        _mapper = mapper;
        _MoedaRepositorio = MoedaService;
    }

    public async Task<Retorno<BussinessException, List<MoedaRespostaViewModel>>> Listar()
    {
        throw new NotImplementedException();
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Obter(long id)
    {
        var Moeda = _MoedaRepositorio.Obter(id).FirstOrDefault();

        if (Moeda is null)
            return new NaoEncontradoException();

        return _mapper.Map<MoedaRespostaViewModel>(Moeda);
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Salvar(MoedaRequisicaoViewModel entity)
    {
        var validacaoRequisicao = entity.ValidarRequisicao();

        if (!validacaoRequisicao.IsValid)
            return new FormatoInvalidoException(validacaoRequisicao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                validacaoRequisicao.Errors.FirstOrDefault()?.ErrorMessage);

        var valePedagio = _mapper.Map<Moeda>(entity);

        var solicitacao = await _MoedaRepositorio.Salvar(valePedagio);

        if (solicitacao.IsFailure)
            return solicitacao.Failure;

        return _mapper.Map<MoedaRespostaViewModel>(solicitacao.Result);
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Atualizar(MoedaRequisicaoViewModel entity)
    {
        throw new NotImplementedException();
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Deletar(long id)
    {
        throw new NotImplementedException();
    }
}