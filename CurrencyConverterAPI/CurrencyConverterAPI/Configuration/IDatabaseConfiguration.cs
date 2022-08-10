namespace CurrencyConverterAPI.Configuration
{
    public interface IDatabaseConfiguration
    {
        public string DatabaseName { get; set; }
        public string CoinsCollectionName { get; set; }
    }
}
