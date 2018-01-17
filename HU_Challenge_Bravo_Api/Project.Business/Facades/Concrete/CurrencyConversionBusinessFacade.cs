using Project.Business.DTOs;
using Project.Business.Enums;
using Project.Business.Facades.Interface;
using Project.Business.HttpConnector;
using System;
using System.Threading.Tasks;

namespace Project.Business.Facades.Concrete
{
    public class CurrencyConversionBusinessFacade : ICurrencyConversionBusinessFacade
    {
        public async Task<CurrencyDTO> GetCurrencyQuotation(string currencySymbol)
        {
            var currencyQuotation = new CurrencyDTO();

            var httpConnector = new ExternalApiConnector(currencySymbol);

            currencyQuotation = await httpConnector.GetCurrencyQuotation();

            return currencyQuotation;
        }

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

            convertedCurrencyData.Quotation_Last_Update = GetDateTimeForLastUpdatedQuotation(toCurrencyQuotation);

            return convertedCurrencyData;
        }

        public decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount)
        {
            decimal result = 0M;

            switch (fromCurrency)
            {
                case "USD":
                    #region ' USD Conversions '

                    // usd to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        //result = GetConvertedValueFromUsdToOtherCurrencies(toCurrencyQuotation.UnitPrice_Brl_in_Usd, amount);
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Brl_in_Usd, amount);

                    // usd to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        //result = GetConvertedValueFromUsdToOtherCurrencies(toCurrencyQuotation.UnitPrice_Eur_in_Usd, amount);
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Eur_in_Usd, amount);

                    // usd to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        //result = amount;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Usd_in_Usd, amount);

                    // usd to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        //result = GetConvertedValueFromUsdToOtherCurrencies(toCurrencyQuotation.UnitPrice_Btc_in_Usd, amount);
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Btc_in_Usd, amount);

                    // usd to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        //result = GetConvertedValueFromUsdToOtherCurrencies(toCurrencyQuotation.UnitPrice_Eth_in_Usd, amount);
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Eth_in_Usd, amount);

                    #endregion
                    break;
                case "BRL":
                    #region ' BRL Conversions '

                    // brl to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        //result = amount;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // brl to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);
                    
                    // brl to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        //result = amount / fromCurrencyQuotation.UnitPrice_Brl_in_Usd;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // brl to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // brl to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    #endregion
                    break;
                case "EUR":
                    #region ' EUR Conversions '

                    // eur to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eur to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        //result = amount;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eur to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        //result = amount / fromCurrencyQuotation.UnitPrice_Eur_in_Usd;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eur to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eur to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    #endregion
                    break;
                case "BTC":
                    #region ' BTC Conversions '

                    // btc to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // btc to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // btc to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        //result = amount / fromCurrencyQuotation.UnitPrice_Btc_in_Usd;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // btc to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        //result = amount;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // btc to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    #endregion
                    break;
                case "ETH":
                    #region ' ETH Conversions '

                    // eth to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        //result = amount / fromCurrencyQuotation.UnitPrice_Eth_in_Usd;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        //result = amount;
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    #endregion
                    break;
                default:
                    throw new InvalidOperationException("unknown item type");
            }

            return result;
        }

        public decimal GetConvertedValueForAnyCurrency(CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal toCurrencyUnitPriceInUsd, decimal amount)
        {
            if (fromCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
            {
                return toCurrencyUnitPriceInUsd * amount;
            }
            if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
            {
                switch (fromCurrencyQuotation.TargetCurrencySymbol)
                {
                    case "BRL":
                        return amount / fromCurrencyQuotation.UnitPrice_Brl_in_Usd;
                    case "EUR":
                        return amount / fromCurrencyQuotation.UnitPrice_Eur_in_Usd;
                    case "BTC":
                        return amount / fromCurrencyQuotation.UnitPrice_Btc_in_Usd;
                    case "ETH":
                        return amount / fromCurrencyQuotation.UnitPrice_Eth_in_Usd;
                    default:
                        throw new InvalidOperationException("unknown item type");
                }
            }
            else if (fromCurrencyQuotation.TargetCurrencySymbol == toCurrencyQuotation.TargetCurrencySymbol)
            {
                return amount;
            }
            else
            {
                var fromAmount = GetAmountValueInUsdCurrency(fromCurrencyQuotation, amount);
                var toAmount = GetAmountValueInUsdCurrency(toCurrencyQuotation, amount);
                var unitValue = fromAmount / toAmount;

                return amount / unitValue;
            }
        }

        public decimal GetAmountValueInUsdCurrency(CurrencyDTO currencyData, decimal amount)
        {
            switch (currencyData.TargetCurrencySymbol)
            {
                case "BRL":
                    return currencyData.UnitPrice_Brl_in_Usd * amount;
                //case "USD":
                //    return currencyData.UnitPrice_Usd_in_Usd * amount;
                case "EUR":
                    return currencyData.UnitPrice_Eur_in_Usd * amount;
                case "BTC":
                    return currencyData.UnitPrice_Btc_in_Usd * amount;
                case "ETH":
                    return currencyData.UnitPrice_Eth_in_Usd * amount;
                default:
                    return currencyData.UnitPrice_Usd_in_Usd * amount;
            }
        }

        private string GetDateTimeForLastUpdatedQuotation(CurrencyDTO toCurrencyQuotation)
        {
            double timestamp = toCurrencyQuotation.Last_updated;
            var date = new DateTime(1970, 1, 1, 0, 0, 0, 0);

            date = date.AddSeconds(timestamp).ToLocalTime();

            return date.ToString("dd/MM/yyyy HH:mm:ss");
        }
    }
}
