namespace CurrencyConverter.Core.Models
{
    public class CurrencyResponse
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public double QuoteDollarPrice { get; set; }
        public ResponseResult ResponseResult { get; set; }
    }
}
