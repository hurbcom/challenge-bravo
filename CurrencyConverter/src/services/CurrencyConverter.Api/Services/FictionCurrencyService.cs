using CurrencyConverter.Api.Data;
using CurrencyConverter.Api.Helpers;
using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public class FictionCurrencyService : IFictionCurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IFiatConvertService _fiatConvertService;
        public FictionCurrencyService(ICurrencyRepository currencyRepository, IFiatConvertService fiatConvertService, IBitCoinConvertService bitCoinConvertService)
        {
            _currencyRepository = currencyRepository;
            _fiatConvertService = fiatConvertService;
        }

        public async Task<List<Currency>> GetFictionsCurrencies(List<string> codes)
        {
            return await _currencyRepository.GetByCodes(codes);
        }

        public async Task<double> ConvertFictionCurrency(string from, string to, double amount, List<Currency> fictionsCurrencies)
        {
            if (CheckCurrencyType.IsFictionCurrency(from, fictionsCurrencies) && CheckCurrencyType.IsFiatCurrency(to))
            {
                var fictionCurrency = fictionsCurrencies.First(f => f.Code == from);
                return await ConvertFictionToFiat(fictionCurrency.QuoteDollarPrice, to, amount);
            }

            if (CheckCurrencyType.IsFiatCurrency(from) && CheckCurrencyType.IsFictionCurrency(to, fictionsCurrencies))
            {
                var fictionCurrency = fictionsCurrencies.First(f => f.Code == to);
                return await ConvertFiatToFiction(from, fictionCurrency.QuoteDollarPrice, amount);
            }

            throw new Exception("Currency not supported");
        }

        public async Task<double> ConvertFictionToFiat(double fictionValueInDollar, string to, double amount)
        {
            //amount of fiction currency in dollar
            var amountFictionInDollar = amount * fictionValueInDollar;

            //convert value in dollar to another fiat currency (ex: BRL)
            return _fiatConvertService.ConvertFiatToFiat("USD", to, amountFictionInDollar);
        }

        public async Task<double> ConvertFiatToFiction(string from, double fictionValueInDollar, double amount)
        {
            //convert 'from' fiat currency amount in dollar amount
            double amountInDollar = amount;
            if (from != "USD")
            {
                amountInDollar = _fiatConvertService.ConvertFiatToFiat(from, "USD", amount);
            }

            //calculate amount in dollar to fiction currency
            return amountInDollar / fictionValueInDollar;
        }
    }
}
