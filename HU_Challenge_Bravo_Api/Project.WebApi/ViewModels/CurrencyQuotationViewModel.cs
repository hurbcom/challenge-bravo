namespace Project.WebApi.ViewModels
{
    /// <summary>
    /// This class is used to get all the data provided by the external API.
    /// </summary>
    public class CurrencyQuotationViewModel
    {
        /// <summary>
        /// This property represents the currency symbol. e.g: USD, BRL, EUR, etc.
        /// </summary>
        public string Symbol { get; set; }

        /// <summary>
        /// This property represents the target currency symbol. In other words,
        /// it's the currency that will have the value converted from a base currency.
        /// </summary>
        public string TargetCurrencySymbol { get; set; }

        /// <summary>
        /// This property represents the last datetime that the quotation was updated 
        /// on the server (external API).
        /// </summary>
        public double Last_updated { get; set; }

        /// <summary>
        /// This property represents the USD unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_usd { get; set; }

        /// <summary>
        /// This property represents the BTC unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_btc { get; set; }

        /// <summary>
        /// This property represents the BRL unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_brl { get; set; }

        /// <summary>
        /// This property represents the ETH unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_eth { get; set; }

        /// <summary>
        /// This property represents the EUR unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_eur { get; set; }
    }
}