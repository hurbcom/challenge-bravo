using System.Text.Json.Serialization;

namespace CurrencyConverter.Api.Models
{
    public class Currency : Entity
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public double QuoteDollarPrice { get; set; }
    }
}
