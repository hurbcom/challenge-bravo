using Project.Business.DTOs;
using Project.Business.Enums;
using Project.Business.Facades.Interface;
using Project.Business.HttpConnector;
using System;
using System.Threading.Tasks;

namespace Project.Business.Facades.Concrete
{
    /// <summary>
    /// This class represent the concrete facade to the currency conversion process.
    /// </summary>
    public class CurrencyConversionBusinessFacade : ICurrencyConversionBusinessFacade
    {
        /// <summary>
        /// This async method is used to get the currency data from the external API.
        /// </summary>
        /// <param name="currencySymbol">string</param>
        /// <returns>json object</returns>
        public async Task<CurrencyDTO> GetCurrencyQuotation(string currencySymbol)
        {
            var currencyQuotation = new CurrencyDTO();
            var httpConnector = new ExternalApiConnector(currencySymbol);

            currencyQuotation = await httpConnector.GetCurrencyQuotation();

            return currencyQuotation;
        }

        /// <summary>
        /// This method is used to get the converted currenvy value and deliver it to the controller layer.
        /// </summary>
        /// <param name="fromCurrencySymbol">string</param>
        /// <param name="toCurrencySymbol">string</param>
        /// <param name="amount">decimal</param>
        /// <returns>json object</returns>
        public async Task<ConvertedCurrencyDTO> GetCurrencyConverted(string fromCurrencySymbol, string toCurrencySymbol, decimal amount)
        {
            var convertedCurrencyData = new ConvertedCurrencyDTO();
            
            // get data from external API to start the conversion calc
            CurrencyDTO fromCurrencyQuotation = await GetCurrencyQuotation(fromCurrencySymbol);
            CurrencyDTO toCurrencyQuotation = await GetCurrencyQuotation(toCurrencySymbol);

            // get the convert value
            var convertedValue = Convert(fromCurrencySymbol, fromCurrencyQuotation, toCurrencyQuotation, amount);

            // set other json object info about the currency conversion
            convertedCurrencyData.From_Currency = fromCurrencySymbol;
            convertedCurrencyData.To_Currency = toCurrencySymbol;
            convertedCurrencyData.Orinigal_Value = amount;
            convertedCurrencyData.Quotation_Last_Update = GetDateTimeForLastUpdatedQuotation(toCurrencyQuotation);

            // if target currency is BTC or ETH, use eight decimal places to represent correctly the currency price
            if (toCurrencySymbol == "BTC" || toCurrencySymbol == "ETH")
                convertedCurrencyData.Converted_Value = Decimal.Round(convertedValue, 8); //eight decimal places
            // else use two decimal places to represent real currencies
            else
                convertedCurrencyData.Converted_Value = Decimal.Round(convertedValue, 2); //two decimal places
            
            return convertedCurrencyData;
        }

        /// <summary>
        /// This method is the first orchestrator in the currency convertion process. It defines what's the base currency
        /// and the target currency, then pass the correct parameters to the 
        /// second orchestrator (GetConvertedValueForAnyCurrency()).
        /// </summary>
        /// <param name="fromCurrency">string</param>
        /// <param name="fromCurrencyQuotation">object</param>
        /// <param name="toCurrencyQuotation">object</param>
        /// <param name="amount">decimal</param>
        /// <returns>decimal</returns>
        public decimal Convert(string fromCurrency, CurrencyDTO fromCurrencyQuotation, CurrencyDTO toCurrencyQuotation, decimal amount)
        {
            decimal result = 0M;

            switch (fromCurrency)
            {
                case "USD":
                    #region ' USD Conversions '

                    // usd to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Brl_in_Usd, amount);

                    // usd to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Eur_in_Usd, amount);

                    // usd to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Usd_in_Usd, amount);

                    // usd to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Btc_in_Usd, amount);

                    // usd to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, toCurrencyQuotation.UnitPrice_Eth_in_Usd, amount);

                    #endregion
                    break;
                case "BRL":
                    #region ' BRL Conversions '

                    // brl to brl
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BRL.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // brl to eur
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.EUR.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);
                    
                    // brl to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
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
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eur to usd
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.USD.ToString())
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
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // btc to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
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
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to btc
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.BTC.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    // eth to eth
                    if (toCurrencyQuotation.TargetCurrencySymbol == CurrencyTypes.ETH.ToString())
                        result = GetConvertedValueForAnyCurrency(fromCurrencyQuotation, toCurrencyQuotation, 0M, amount);

                    #endregion
                    break;
                default:
                    throw new InvalidOperationException("unknown item type");
            }

            return result;
        }

        /// <summary>
        /// This method is the second orchestrator in the currency conversion process.It defines 
        /// what calculation must be done based on the base or target currencies.
        /// </summary>
        /// <param name="fromCurrencyQuotation">object</param>
        /// <param name="toCurrencyQuotation">object</param>
        /// <param name="toCurrencyUnitPriceInUsd">decimal</param>
        /// <param name="amount">decimal</param>
        /// <returns>decimal</returns>
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

        /// <summary>
        /// This method is used to get the currency value in USD based on informed amount.
        /// </summary>
        /// <param name="currencyData">object</param>
        /// <param name="amount">decimal</param>
        /// <returns>decimal</returns>
        public decimal GetAmountValueInUsdCurrency(CurrencyDTO currencyData, decimal amount)
        {
            switch (currencyData.TargetCurrencySymbol)
            {
                case "BRL":
                    return currencyData.UnitPrice_Brl_in_Usd * amount;
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

        /// <summary>
        /// This method is used to get the datetime from the external API tha comes in timestamp format.
        /// A conversion is made in orther to get a legible datimetime info.
        /// </summary>
        /// <param name="toCurrencyQuotation">object</param>
        /// <returns>datetime as string</returns>
        private string GetDateTimeForLastUpdatedQuotation(CurrencyDTO toCurrencyQuotation)
        {
            double timestamp = toCurrencyQuotation.Last_updated;
            var date = new DateTime(1970, 1, 1, 0, 0, 0, 0);

            date = date.AddSeconds(timestamp).ToLocalTime();

            return date.ToString("dd/MM/yyyy HH:mm:ss");
        }
    }
}
