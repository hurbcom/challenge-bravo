using CurrencyConverter.WebApp.MVC.Models;
using Microsoft.Extensions.Options;
using CurrencyConverter.WebApp.MVC.Extensions;
using CurrencyConverter.Core.Models;
using Microsoft.AspNetCore.Http;

namespace CurrencyConverter.WebApp.MVC.Services
{
    public class CurrencyConverterService : Service, ICurrencyConverterService
    {
        private readonly HttpClient _httpClient;

        public CurrencyConverterService(HttpClient httpClient, IOptions<AppSettings> appSettings)
        {
            httpClient.BaseAddress = new Uri(appSettings.Value.ConverterApiUrl);
            _httpClient = httpClient;   
        }
        public async Task<CurrencyConverterResponse> Converter(CurrencyConverterViewModel currencyConverterViewModel)
        {
            var queryString = $"from/{currencyConverterViewModel.From}/to/{currencyConverterViewModel.To}/amount/{currencyConverterViewModel.Amount}";
            var response = await _httpClient.GetAsync(queryString);

            if (!TryError(response))
            {
                return new CurrencyConverterResponse
                {
                    ResponseResult = await DeserializeObjectResponse<ResponseResult>(response)
                };
            };

            return await DeserializeObjectResponse<CurrencyConverterResponse>(response);
        }

        public async Task<CurrencyResponse> Create(CurrencyViewModel currencyViewModel)
        {
            var response = await _httpClient.PostAsJsonAsync("", currencyViewModel);

            if (!TryError(response))
            {
                return new CurrencyResponse
                {
                    ResponseResult = await DeserializeObjectResponse<ResponseResult>(response)
                };
            };

            return await DeserializeObjectResponse<CurrencyResponse>(response);
        }

        public async Task<CurrencyResponse> Delete(string code)
        {
            var response = await _httpClient.DeleteAsync(code);

            if (!TryError(response))
            {
                return new CurrencyResponse
                {
                    ResponseResult = await DeserializeObjectResponse<ResponseResult>(response)
                };
            };

            return new CurrencyResponse();
        }

        public async Task<FictionCurrenciesResponse> GetAll()
        {
            var response = await _httpClient.GetAsync("");

            if (!TryError(response))
            {
                return new FictionCurrenciesResponse
                {
                    ResponseResult = await DeserializeObjectResponse<ResponseResult>(response)
                };
            };

            var currencies = await DeserializeObjectResponse<List<CurrencyViewModel>>(response);
            return new FictionCurrenciesResponse { Currencies = currencies };
        }
    }
}
