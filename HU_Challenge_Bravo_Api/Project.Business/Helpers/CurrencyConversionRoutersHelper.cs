namespace Project.Business.Helpers
{
    /// <summary>
    /// This class is used to provide the route for consuption to the external API.
    /// </summary>
    public class CurrencyConversionRoutersHelper
    {
        public const string GET_BITCOIN_QUOTATION = @"https://api.coinmarketcap.com/v1/ticker/bitcoin";
    }
}
