using Project.Business.DTOs;
using Project.Business.Enums;
using Project.Business.Facades.Interface;
using Project.Business.HttpConnector;
using System;
using System.Threading.Tasks;

namespace Project.Business.Facades.Concrete
{
    //ToDo: Refactoring - Review the name of the facades to be more legible/semantic (make more sense)
    public class CurrencyConversionFacade : ICurrencyConversionFacade
    {
        public async Task<decimal> GetCurrencyConverted(string fromCurrency, string toCurrency, decimal amount)
        {
            decimal convertedValue = 0M;

            CurrencyDTO fromCurrencyQuotation = await GetCurrencyQuotation(fromCurrency);
            CurrencyDTO toCurrencyQuotation = await GetCurrencyQuotation(toCurrency);

            convertedValue = Convert(fromCurrency, fromCurrencyQuotation, toCurrencyQuotation, amount);

            return Decimal.Round(convertedValue, 8);
        }

        public decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount)
        {
            decimal result = 0M;

            //if (fromUnitPrice < toUnitPrice)
            //    result = amount * toUnitPrice;
            //else
            //    result = amount / toUnitPrice;

            switch (fromCurrency)
            {
                case "USD": // usd to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                    {
                        result = GetValueConverted(fromCurrencyQuotation, toCurrencyQuotation, amount);
                    }
                    //if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                    //{

                    //}
                    //if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                    //{

                    //}
                    //if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                    //{

                    //}
                    //if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                    //{

                    //}
                    break;
                case "BRL":
                    break;
                case "EUR":
                    break;
                case "BTC":
                    break;
                case "ETH":
                    break;
                default:
                    break;
            }

            return result;
        }

        private static decimal GetValueConverted(CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount)
        {
            decimal result = 0M;

            if (fromCurrencyQuotation.UnitPrice_Brl_in_Brl < toCurrencyQuotation.UnitPrice_Usd_in_Brl)
                result = amount * toCurrencyQuotation.UnitPrice_Usd_in_Brl;
            else
                result = amount / toCurrencyQuotation.UnitPrice_Usd_in_Brl;

            return result;
        }

        public async Task<CurrencyDTO> GetCurrencyQuotation(string currencyTicker)
        {
            var quotation = new CurrencyDTO();

            var connnector = new ExternalApiConnector(currencyTicker);

            quotation = await connnector.GetCurrencyQuotation();

            return quotation;
        }
    }
}
