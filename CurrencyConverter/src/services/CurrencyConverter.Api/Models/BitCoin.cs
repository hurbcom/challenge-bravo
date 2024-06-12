namespace CurrencyConverter.Api.Models
{
    public class CurrencyCode(string symbol, string path)
    {
        public string Symbol { get; } = symbol;
        public string Path { get; } = path;
    }
}
