using CurrencyConverter.Api.Helpers;
using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Settings;
using Microsoft.Extensions.Options;
using System.Net.Http;

namespace CurrencyConverter.Api.Services
{
    public class BitCoinConvertService : IBitCoinConvertService
    {
        private readonly IFiatConvertService _fiatConvertService;
        private readonly HttpClient _httpClient;

        public List<CurrencyCode> _bitCoinCurrencies =
        [
            new CurrencyCode("BTC", "bitcoin/"),
            new CurrencyCode("ETH", "ethereum/")
        ];

        public BitCoinConvertService(IFiatConvertService fiatConvertService, HttpClient httpClient, IOptions<AppSettings> appSettings)
        {
            _fiatConvertService = fiatConvertService;
            httpClient.BaseAddress = new Uri(appSettings.Value.CryptoExternalUrl);
            _httpClient = httpClient;
        }

        public async Task<double> ConvertBitCoin(string from, string to, double amount, List<Currency> fictionsCurrencies)
        {
            if (CheckCurrencyType.IsBitCoinCurrency(from) && CheckCurrencyType.IsFiatCurrency(to))
            {
                return await ConvertBitCoinToFiat(from, to, amount);
            }

            if (CheckCurrencyType.IsFiatCurrency(from) && CheckCurrencyType.IsBitCoinCurrency(to))
            {
                return await ConvertFiatToBitCoin(from, to, amount);
            }

            if (CheckCurrencyType.IsBitCoinCurrency(from) && CheckCurrencyType.IsFictionCurrency(to, fictionsCurrencies))
            {
                var fictionCurrency = fictionsCurrencies.First(f => f.Code == to);
                return await ConvertBitCoinToFiction(from, fictionCurrency.QuoteDollarPrice, amount);
            }

            if (CheckCurrencyType.IsFictionCurrency(from, fictionsCurrencies) && CheckCurrencyType.IsBitCoinCurrency(to))
            {
                var fictionCurrency = fictionsCurrencies.First(f => f.Code == from);
                return await ConvertFictionToBitCoin(fictionCurrency.QuoteDollarPrice, to, amount);
            }

            throw new Exception("Currency not supported");
        }

        public async Task<double> ConvertBitCoinToFiat(string from, string to, double amount)
        {
            //get bitcoin (BTC or ETH) value in dollar
            var bitcoinValueInDollar = await GetBitCoinValueInDollar(from);

            //amount de bitcoins in dollar
            var amountBitCoinsInDollar = amount * bitcoinValueInDollar;

            //convert value in dollar to another fiat currency (ex: BRL)
            double amountFinal = amountBitCoinsInDollar;
            if (from != "USD")
            {
                amountFinal = _fiatConvertService.ConvertFiatToFiat("USD", to, amountBitCoinsInDollar);
            }

            return amountFinal;
        }

        public async Task<double> ConvertFiatToBitCoin(string from, string to, double amount)
        {
            //get bitcoin (BTC or ETH) value in dollar
            var bitcoinValueInDollar = await GetBitCoinValueInDollar(to);

            //convert 'from' fiat currency amount in dollar amount
            double amountInDollar = amount;
            if (from != "USD")
            {
                amountInDollar = _fiatConvertService.ConvertFiatToFiat(from, "USD", amount);
            }

            //calculate amount in dollar to bitcoin
            return amountInDollar / bitcoinValueInDollar;
        }

        public async Task<double> ConvertFictionToBitCoin(double fictionValueInDollar, string to, double amount)
        {
            //get bitcoin (BTC or ETH) value in dollar
            var bitcoinValueInDollar = await GetBitCoinValueInDollar(to);

            //convert 'from' fiction currency amount in dollar amount
            double amountInDollar = fictionValueInDollar * amount;

            //calculate amount in dollar to bitcoin
            return amountInDollar / bitcoinValueInDollar;
        }

        public async Task<double> ConvertBitCoinToFiction(string from, double fictionValueInDollar, double amount)
        {
            //get bitcoin (BTC or ETH) value in dollar
            var bitcoinValueInDollar = await GetBitCoinValueInDollar(from);

            //amount de bitcoins in dollar
            var amountBitCoinsInDollar = amount * bitcoinValueInDollar;

            //convert value in dollar to fiction currency (ex: Dungeons & Dragons)
            return amountBitCoinsInDollar / fictionValueInDollar;
        }

        private async Task<double> GetBitCoinValueInDollar(string btcSymbol)
        {
            var bitcoin = _bitCoinCurrencies.First(a => a.Symbol == btcSymbol);
            var bitcoinValueInDollar = await GetBitCoinDollarQuoteValue(bitcoin.Path);

            return bitcoinValueInDollar;
        }

        private async Task<double> GetBitCoinDollarQuoteValue(string path)
        {
            var test = await _httpClient.GetAsync(path);
            var quotes = await test.Content.ReadFromJsonAsync<BitcoinQuotes>();

            if (path == "bitcoin/")
                return quotes.Data._1.Quotes.USD.Price;

            if (path == "ethereum/")
                return quotes.Data._1027.Quotes.USD.Price;

            throw new Exception("Bitcoin not supported");
        }
    }
}
