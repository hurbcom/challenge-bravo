namespace CurrencyConverterAPI.Configuration
{
    public interface IApiConfiguration
    {
        public string BaseUrl { get; set; }
        public string CurrencyBallast { get; set; }
    }
}
