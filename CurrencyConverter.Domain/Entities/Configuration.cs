using CurrencyConverter.Domain.Interfaces;

namespace CurrencyConverter.Domain.Entities
{
    public class Configuration : IEntity
    {
        public int id { get; set; } = 0;
        public int refreshTime { get; set; } = 15;
        public string baseRate { get; set; } = "USD";
    }
}
