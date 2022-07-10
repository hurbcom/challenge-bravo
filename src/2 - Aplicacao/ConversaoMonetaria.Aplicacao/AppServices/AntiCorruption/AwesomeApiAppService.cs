using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using ConversaoMoneraria.AntiCorruption.AwesomeApi.Interfaces;
using ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.DTO.AntiCorruption.AwesomeApi;
using ConversaoMonetaria.Dominio.Entidades.Moedas;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;
using ConversaoMonetaria.Dominio.Servicos;

namespace ConversaoMonetaria.Aplicacao.AppServices.AntiCorruption;

public class AwesomeApiAppService : IAwesomeApiAppService
{
    private readonly IAwesomeApiService _awesomeApiService;
    private readonly ConversaoMonetariaService _conversaoMonetariaService;
    private readonly IMoedaRepositorio _moedaRepositorio;

    public AwesomeApiAppService(IMoedaRepositorio moedaService,
        IAwesomeApiService awesomeApiService, ConversaoMonetariaService conversaoMonetariaService)
    {
        _moedaRepositorio = moedaService;
        _awesomeApiService = awesomeApiService;
        _conversaoMonetariaService = conversaoMonetariaService;
    }

    public async Task<Retorno<BussinessException, bool>> AtualizarCotacoes()
    {
        var moedas = _moedaRepositorio.Listar().ToList().Where(p => p.EhAtiva());

        var resultadoConsultaCotacoes = await _awesomeApiService.BuscarCotacoes();

        if (resultadoConsultaCotacoes.EhFalha())
        {
            foreach (var moeda in moedas)
                await AtualizarCotacaoDeUmaMoeda(moeda);

            return resultadoConsultaCotacoes.Failure;
        }

        foreach (var moeda in moedas)
            await AtualizarCotacaoDeUmaMoeda(moeda, resultadoConsultaCotacoes.Result.Cotacoes);

        return true;
    }

    private async Task AtualizarCotacaoDeUmaMoeda(Moeda moeda, Dictionary<string, AwesomeRetorno> cotacoes = null)
    {
        var cotacaoAtual = moeda.Cotacao;

        // Adicionado o (* 1000) pois a API está retornando o valor do BTC errado.
        if (cotacoes is not null && cotacoes.ContainsKey(moeda.Codigo))
            cotacaoAtual = moeda.Codigo.Equals("BTC") || moeda.Codigo.Equals("ETH")
                ? Convert.ToDecimal(cotacoes[moeda.Codigo].Ask, new CultureInfo("en-US")) * 1000
                : Convert.ToDecimal(cotacoes[moeda.Codigo].Ask, new CultureInfo("en-US"));

        _conversaoMonetariaService.AdicionarCotacao(moeda.Codigo, cotacaoAtual);

        if (moeda.Cotacao != cotacaoAtual)
        {
            moeda.Cotacao = cotacaoAtual;

            await _moedaRepositorio.Atualizar(moeda);
        }
    }
}