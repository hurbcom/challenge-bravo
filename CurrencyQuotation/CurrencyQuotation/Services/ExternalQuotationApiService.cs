using CurrencyQuotation.Models.Dtos;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace CurrencyQuotation.Services
{
    public class ExternalQuotationApiService : IExternalQuotationApiService
    {
        private readonly IHttpClientFactory _clientFactory;

        private readonly ILogger _logger;

        private string ExternalApiUrl { get; set; }
        private string TokenApi { get; set; }

        public ExternalQuotationApiService(IConfiguration configuration, IHttpClientFactory clientFactory, ILogger<ExternalQuotationApiService> logger)
        {
            this.ExternalApiUrl = configuration.GetValue<string>("ExternalQuotationApiService.ExternalApiUrl");
            this.TokenApi = configuration.GetValue<string>("ExternalQuotationApiService.TokenApi");

            this._clientFactory = clientFactory;
            this._logger = logger;
        }

        public ExternalApiDto GetCurrenciesQuotationsInDolar()
        {
            string requestUri = string.Concat(this.ExternalApiUrl, this.TokenApi);

            ExternalApiDto currenciesQuotations = SendHttpGetRequest<ExternalApiDto>(requestUri).Result;

            return currenciesQuotations;
        }

        private async Task<T> SendHttpGetRequest<T>(string requestUri)
        {
            try
            {
                HttpClient httpClient = this._clientFactory.CreateClient();
                var response = await httpClient.GetAsync(requestUri);

                response.EnsureSuccessStatusCode();

                using var responseStream = await response.Content.ReadAsStreamAsync();

                this._logger.LogInformation(responseStream.ToString());

                return await JsonSerializer.DeserializeAsync<T>(responseStream);
            }
            catch (Exception ex)
            {
                this._logger.LogError($"Erro: {ex.Message}");
                return default;
            }
        }
    }
}
