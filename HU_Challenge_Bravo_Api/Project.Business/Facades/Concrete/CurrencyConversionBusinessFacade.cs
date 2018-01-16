using Project.Business.DTOs;
using Project.Business.Enums;
using Project.Business.Facades.Interface;
using Project.Business.HttpConnector;
using System;
using System.Threading.Tasks;

namespace Project.Business.Facades.Concrete
{
    //ToDo: Refactoring - Review the name of the facades to be more legible/semantic (make more sense)
    public class CurrencyConversionBusinessFacade : ICurrencyConversionBusinessFacade
    {
        public async Task<ConvertedCurrencyDTO> GetCurrencyConverted(string fromCurrencySymbol, string toCurrencySymbol, decimal amount)
        {
            var convertedCurrencyData = new ConvertedCurrencyDTO();

            CurrencyDTO fromCurrencyQuotation = await GetCurrencyQuotation(fromCurrencySymbol);
            CurrencyDTO toCurrencyQuotation = await GetCurrencyQuotation(toCurrencySymbol);

            var convertedValue = Convert(fromCurrencySymbol, fromCurrencyQuotation, toCurrencyQuotation, amount);

            convertedCurrencyData.From_Currency = fromCurrencySymbol;
            convertedCurrencyData.To_Currency = toCurrencySymbol;
            convertedCurrencyData.Orinigal_Value = amount;

            if (toCurrencySymbol == "BTC" || toCurrencySymbol == "ETH")
            {
                convertedCurrencyData.Converted_Value = Decimal.Round(convertedValue, 8);
            }
            else
            {
                convertedCurrencyData.Converted_Value = Decimal.Round(convertedValue, 2);
            }

            convertedCurrencyData.Quotation_Last_Update = GetLasUpdatedQuotationDateTime(toCurrencyQuotation);

            return convertedCurrencyData;
        }

        private string GetLasUpdatedQuotationDateTime(CurrencyDTO toCurrencyQuotation)
        {
            double timestamp = toCurrencyQuotation.Last_updated;
            var date = new DateTime(1970, 1, 1, 0, 0, 0, 0);

            date = date.AddSeconds(timestamp).ToLocalTime();

            return date.ToString("dd/MM/yyyy HH:mm:ss");
        }

        private decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount)
        {
            decimal result = 0M;

            switch (fromCurrency)
            {
                case "USD":
                    #region ' USD Conversions '

                    // usd to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                    {
                        result = GetValueConvertedInUsd(fromCurrencyQuotation.UnitPrice_Brl_in_Brl, toCurrencyQuotation.UnitPrice_Brl_in_Usd, amount);
                    }
                    // usd to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                    {
                        result = GetValueConvertedInUsd(fromCurrencyQuotation.UnitPrice_Eur_in_Eur, toCurrencyQuotation.UnitPrice_Eur_in_Usd, amount);
                    }
                    // usd to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                    {
                        result = amount;
                    }
                    // usd to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                    {
                        result = GetValueConvertedInUsd(fromCurrencyQuotation.UnitPrice_Btc_in_Btc, toCurrencyQuotation.UnitPrice_Btc_in_Usd, amount);
                    }
                    // usd to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                    {
                        result = GetValueConvertedInUsd(fromCurrencyQuotation.UnitPrice_Eth_in_Eth, toCurrencyQuotation.UnitPrice_Eth_in_Usd, amount);
                    }

                    #endregion
                    break;
                case "BRL":
                    #region ' BRL Conversions '

                    // brl to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                    {
                        result = amount;
                    }
                    // brl to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                    {
                        var brlAmount = fromCurrencyQuotation.UnitPrice_Brl_in_Usd * amount;
                        var eurAmount = toCurrencyQuotation.UnitPrice_Eur_in_Usd * amount;
                        var unitPrice_Brl_in_Eur = brlAmount / eurAmount;
                        
                        result = amount / unitPrice_Brl_in_Eur;
                    }
                    // brl to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                    {
                        var brlAmount = fromCurrencyQuotation.UnitPrice_Brl_in_Usd * amount;

                        result = amount / fromCurrencyQuotation.UnitPrice_Brl_in_Usd;
                    }
                    //// brl to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                    {
                        var brlAmount = fromCurrencyQuotation.UnitPrice_Brl_in_Usd * amount;
                        var btcAmount = toCurrencyQuotation.UnitPrice_Btc_in_Usd * amount;
                        var unitPrice_Brl_in_Btc = brlAmount / btcAmount;

                        result = amount / unitPrice_Brl_in_Btc;
                    }
                    //// brl to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                    {
                        var brlAmount = fromCurrencyQuotation.UnitPrice_Brl_in_Usd * amount;
                        var ethAmount = toCurrencyQuotation.UnitPrice_Eth_in_Usd * amount;
                        var unitPrice_Brl_in_Eth = brlAmount / ethAmount;

                        result = amount / unitPrice_Brl_in_Eth;
                    }

                    #endregion
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

        private decimal GetValueConvertedInUsd(decimal fromAnyCurrencyUnitPrice, decimal toCurrencyUnitPriceInUsd, decimal amount)
        {
            var result = amount * toCurrencyUnitPriceInUsd;

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
