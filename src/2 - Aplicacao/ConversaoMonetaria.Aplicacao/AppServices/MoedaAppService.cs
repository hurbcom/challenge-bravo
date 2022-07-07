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
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;

namespace ConversaoMonetaria.Aplicacao.AppServices;

public class MoedaAppService : IMoedaAppService
{
    private readonly IMapper _mapper;
    private readonly IMoedaRepositorio _MoedaRepositorio;

    public MoedaAppService(IMapper mapper, IMoedaRepositorio MoedaService)
    {
        _mapper = mapper;
        _MoedaRepositorio = MoedaService;
    }

    public Task<Retorno<BussinessException, MoedaListarRespostaViewModel>> Listar()
    {
        var Moeda = _MoedaRepositorio.Listar().ToList().Where(p => p.EhAtiva());

        return Task.FromResult<Retorno<BussinessException, MoedaListarRespostaViewModel>>(_mapper.Map<IEnumerable<Moeda>, MoedaListarRespostaViewModel>(Moeda));
    }

    public Task<Retorno<BussinessException, MoedaRespostaViewModel>> Obter(long id)
    {
        var moeda = _MoedaRepositorio.Obter(id).FirstOrDefault();

        if (moeda is null || !moeda.EhAtiva())
            return Task.FromResult<Retorno<BussinessException, MoedaRespostaViewModel>>(new NaoEncontradoException());

        return Task.FromResult<Retorno<BussinessException, MoedaRespostaViewModel>>(_mapper.Map<MoedaRespostaViewModel>(moeda));
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Salvar(MoedaRequisicaoViewModel entity)
    {
        var validacaoRequisicao = entity.ValidarRequisicao();

        if (!validacaoRequisicao.IsValid)
            return new FormatoInvalidoException(validacaoRequisicao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                validacaoRequisicao.Errors.FirstOrDefault()?.ErrorMessage);

        var moeda = _mapper.Map<Moeda>(entity);

        var resultadovalidacao = moeda.Validar();

        if (!resultadovalidacao.IsValid)
            return new FormatoInvalidoException(resultadovalidacao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                resultadovalidacao.Errors.FirstOrDefault()?.ErrorMessage);

        await _MoedaRepositorio.Salvar(moeda);

        return _mapper.Map<MoedaRespostaViewModel>(moeda);
    }

    public async Task<Retorno<BussinessException, MoedaRespostaViewModel>> Atualizar(long id,
        MoedaRequisicaoViewModel entity)
    {
        var validacaoRequisicao = entity.ValidarRequisicao();

        if (!validacaoRequisicao.IsValid)
            return new FormatoInvalidoException(validacaoRequisicao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                validacaoRequisicao.Errors.FirstOrDefault()?.ErrorMessage);

        //var moedaNova = _mapper.Map<Moeda>(entity);
        var moeda = _MoedaRepositorio.Obter(id).FirstOrDefault();

        if (moeda is null || !moeda.EhAtiva())
            return new NaoEncontradoException();

        entity.CopiarTodasAsPropriedadesPara(moeda);
        var resultadoValidacao = moeda.Validar();

        if (!resultadoValidacao.IsValid)
            return new FormatoInvalidoException(resultadoValidacao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                resultadoValidacao.Errors.FirstOrDefault()?.ErrorMessage);

        await _MoedaRepositorio.Atualizar(moeda);

        return _mapper.Map<MoedaRespostaViewModel>(moeda);
    }

    public async Task<Retorno<BussinessException, bool>> Deletar(long id)
    {
        var moeda = _MoedaRepositorio.Obter(id).FirstOrDefault();

        if (moeda is null || !moeda.EhAtiva())
            return new NaoEncontradoException();

        var resultadovalidacaoExclusao = moeda.Excluir();

        if (!resultadovalidacaoExclusao.IsValid)
            return new FormatoInvalidoException(resultadovalidacaoExclusao.Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                resultadovalidacaoExclusao.Errors.FirstOrDefault()?.ErrorMessage);

        await _MoedaRepositorio.Atualizar(moeda);

        return true;
    }
}