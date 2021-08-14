using Abp.Application.Services;
using Abp.Authorization;
using Abp.UI;
using ChallengeBravo.Base.Consts;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CSharp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ChallengeBravo.Servicos
{
    public class ServicoAppService : ApplicationService
    {
        private readonly IConfiguration _iconfig;

        public ServicoAppService(IConfiguration configuration)
        {
            _iconfig = configuration;
        }

        [AbpAuthorize]
        public async Task<List<ServicoInputDto>> GetFromService(string url, [CanBeNull] string parametros)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    var responseGet = await httpClient.GetAsync(url + parametros);

                    var apiResponse = await responseGet.Content.ReadAsStringAsync();

                    List<ServicoInputDto> listInputs = new List<ServicoInputDto>();

                    ServicoInputDto input = new ServicoInputDto();

                    JObject obj = JObject.Parse(apiResponse);

                    if(!apiResponse.Contains("status"))
                    {
                        foreach (JProperty singleProp in obj.Properties())
                        {
                            input.code = singleProp.Value["code"].ToString();
                            input.codein = singleProp.Value["codein"].ToString();
                            input.name = singleProp.Value["name"].ToString();
                            input.high = singleProp.Value["high"].ToString();
                            input.low = singleProp.Value["low"].ToString();
                            input.varBid = singleProp.Value["varBid"].ToString();
                            input.pctChange = singleProp.Value["pctChange"].ToString();
                            //input.bid = float.Parse(singleProp.Value["bid"].ToString());
                            input.bid = float.Parse(singleProp.Value["bid"].ToString().Replace('.', ','));
                            input.ask = singleProp.Value["ask"].ToString();
                            input.timestamp = singleProp.Value["timestamp"].ToString();
                            input.create_date = singleProp.Value["create_date"].ToString();

                            listInputs.Add(input);

                        }
                    }

                    return listInputs;

                }
            }
            catch (Exception e)
            {
                throw new UserFriendlyException(e.Message);
            }
        }

        [AbpAuthorize]
        [HttpGet]
        public async Task<List<ServicoInputDto>> ObterCotacaoEmDolar(List<string> listaMoedas)
        {
            List<ServicoInputDto> servicoInputDtos = new List<ServicoInputDto>();

            foreach (var item in listaMoedas)
            {
                if(item != "USD" && item != null)
                {
                    var retorno = await GetFromService(_iconfig.GetValue<string>("AwesomeAPI:Url"), string.Format(MoedasConsts.obterCotacao, item));

                    foreach (var cotacao in retorno)
                    {
                        servicoInputDtos.Add(cotacao);
                    }
                }
                else
                {
                    if(item == "USD")
                    {
                        servicoInputDtos.Add(new ServicoInputDto { bid = 1.0f, code = "USD", name = "Dólar Americano" });
                    }
                }

                
            }

            return servicoInputDtos;
        }

    } 
}
