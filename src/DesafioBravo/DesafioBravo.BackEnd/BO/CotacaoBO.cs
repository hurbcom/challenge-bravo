using DesafioBravoBackEnd.Data;
using DesafioBravoBackEnd.DTO;
using DesafioBravoBackEnd.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace DesafioBravoBackEnd.BO
{
    public class CotacaoBO : ICotacaoBO
    {
        AppDbContext context = null;

        public CotacaoBO(AppDbContext context)
        {
            this.context = context;
        }

        public CotacaoDTO Buscar(string from, string to, string amount)
        {
            Moeda moedaOrigem = new MoedaBO(context).Buscar(from).moeda;
            Moeda moedaDestino = new MoedaBO(context).Buscar(to).moeda;

            if (moedaOrigem == null || moedaOrigem?.ValorEmDolar == 0 || moedaDestino == null || moedaDestino?.ValorEmDolar == 0)
            {
                MoedaBO moedaBO = new MoedaBO(context);
                moedaBO.Adicionar(from, 0);
                moedaBO.Adicionar(to, 0);
            }

            CotacaoDTO dto = CalcularCotacao(moedaOrigem, moedaDestino, amount);

            if (dto.retorno == null)
                dto.retorno = RetornaValidacao(dto);

            return dto;
        }

        private RetornoDTO RetornaValidacao(CotacaoDTO dto)
        {
            RetornoDTO retornoDTO = new RetornoDTO();

            string mensagem = string.Empty;

            if (dto.cotacao.moedaOrigem.ValorEmDolar <= 0)
                mensagem += $"Moeda {dto.cotacao.moedaOrigem.Codigo} não possui valor cadastrado. ";

            if (dto.cotacao.moedaDestino.ValorEmDolar <= 0)
                mensagem += $"Moeda {dto.cotacao.moedaDestino.Codigo} não possui valor cadastrado. ";

            if (dto.cotacao.valorConvertido <= 0)
                mensagem += "Valor não pode ser convertido.";

            if (!string.IsNullOrEmpty(mensagem))
            {
                retornoDTO.mensagem = mensagem;
                retornoDTO.sucesso = false;
            }

            return retornoDTO;
        }

        private CotacaoDTO CalcularCotacao(Moeda moedaOrigem, Moeda moedaDestino, string sValorParaConversao)
        {
            CotacaoDTO dto = new CotacaoDTO();
            try
            {

                decimal valorParaConversao = decimal.Parse(sValorParaConversao, System.Globalization.CultureInfo.InvariantCulture);
                decimal valorCovertido = (moedaDestino.ValorEmDolar / moedaOrigem.ValorEmDolar) * valorParaConversao;

                if (valorCovertido <= 0)
                {
                    dto.retorno = new RetornoDTO() { sucesso = false, mensagem = "Erro ao efetuar calculo da cotação: Divisão por zero" };
                    valorCovertido = 0;
                }

                dto.cotacao = new Cotacao()
                {
                    moedaOrigem = moedaOrigem,
                    moedaDestino = moedaDestino,
                    valorParaConversao = valorParaConversao,
                    valorConvertido = valorCovertido
                };
            }
            catch (Exception ex)
            {
                dto.retorno = new RetornoDTO() { sucesso = false, mensagem = "Erro ao efetuar calculo da cotação: " + ex.Message };
            }
            return dto;
        }

        internal string BuscarCotacoesWebService()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            string chaveacessoAPI = configuration.GetSection("InformacoesAplicacao").GetSection("ChaveAPIOpenExchangeRates").Value;

            Task<string> apiResponse = null;
            using (var httpClient = new HttpClient())
            {
                var responseGet = httpClient.GetAsync($"https://openexchangerates.org/api/latest.json?app_id={chaveacessoAPI}");

                apiResponse = responseGet.Result.Content.ReadAsStringAsync();
            }

            return apiResponse.Result;
        }
    }
}