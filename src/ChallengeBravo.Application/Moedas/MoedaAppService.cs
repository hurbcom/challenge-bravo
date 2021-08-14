using Abp.Application.Services;
using Abp.Authorization;
using Abp.UI;
using ChallengeBravo.Base;
using ChallengeBravo.Base.Consts;
using ChallengeBravo.Servicos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChallengeBravo.Moedas
{
    [AbpAuthorize]
    public class MoedaAppService : AppServiceBase<Moeda, MoedaInputDto, MoedaOutputDto>
    {
        private readonly IMoedaManager _manager;

        private readonly ServicoAppService _servicoApp;

        public MoedaAppService(IMoedaManager moedaManager, ServicoAppService servicoApp) : base(moedaManager)
        {
            _manager = moedaManager;
            _servicoApp = servicoApp;
        }

        /*
         * A importação utilizará uma lista com as moedas originais e dessa forma importará as moedas da base + a lista original.
         * Além das moedas da lista original, esse método também tentará importar a cotação de moedas inseridas pelo usuário.
         * Caso sejam fictícias, a aplicação ignorará o possível "erro" e seguirá com a execução.
         * Além disso, a moeda dólar foi utilizada como lastro.
         */
        [AbpAuthorize]
        public async Task ImportarCotacoesAsync()
        {
            var retorno = _manager.ObterTodos();

            List<string> listaMoedas = new List<string>();
            
            List<MoedaOutputDto> moedaOutputDtos = ObjectMapper.Map<List<MoedaOutputDto>>(retorno);

            foreach(var item in moedaOutputDtos)
            {
                listaMoedas.Add(item.Codigo);
            }

            foreach (var item in MoedasConsts.listaMoedasOriginais)
            {
                listaMoedas.Add(item);
            }

            var cotacoes = await _servicoApp.ObterCotacaoEmDolar(listaMoedas);

            foreach(var item in cotacoes)
            {
                var moedaFinal = ObjectMapper.Map<Moeda>(item);

                var consulta = _manager.ObterIdPorCodigo(moedaFinal.Codigo);

                if (consulta == Guid.Empty)
                {
                    _manager.Inserir(moedaFinal);
                }
                else
                {
                    var moedaAuxiliar = _manager.ObterPorId(consulta);

                    moedaAuxiliar.ValorUSD = moedaFinal.ValorUSD;

                    _manager.Atualizar(moedaAuxiliar);
                }
            }
        }

     
        [AbpAuthorize]
        [HttpGet]
        public float ConverterMoedas(string codigoOrigem, string codigoDestino, float valorOrigem)
        {
            //Toda vez que o método de ConverterMoedas for chamado, a aplicação chamará o método assíncrono de ImportarCotacoes 
            //para atualizar a base de dados. A execução do método ConverterMoedas não depende da finalização dessa chamada.

            ImportarCotacoesAsync();

            return _manager.ConverterMoedas(codigoOrigem, codigoDestino, valorOrigem);
        }

        [AbpAuthorize]
        public Guid ObterIdPorCodigo(string codigo)
        {
            return _manager.ObterIdPorCodigo(codigo);
        }

        [AbpAuthorize]
        [HttpDelete]
        public void ApagarPorCodigo(string codigo)
        {
            _manager.ApagarPorCodigo(codigo);
        }

        [AbpAuthorize]
        public override string ObterMensagemNaoEncontrado()
        {
            return "Moeda não encontrada";
        }
    }
}
