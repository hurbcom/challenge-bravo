namespace CurrencyConverterAPI.Configuration.Implementation
{
    public class DatabaseConfiguration : IDatabaseConfiguration
    {
        public string DatabaseName { get; set; }
        public string CoinsCollectionName { get; set; }
    }
}
