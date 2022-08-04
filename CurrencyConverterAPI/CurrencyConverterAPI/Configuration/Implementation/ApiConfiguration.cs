namespace CurrencyConverterAPI.Configuration
{
    public sealed class ApiConfiguration : IApiConfiguration
    {
        public string BaseUrl { get; set; }
        public string CurrencyBallast { get; set; }
    }
}
