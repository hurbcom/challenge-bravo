using CurrencyConverter.Domain.Interfaces;

namespace CurrencyConverter.Domain.Entities
{
    public class Configuration : IEntity
    {
        public int id { get; set; }
        public int refreshTime { get; set; }
        public string baseRate { get; set; }
    }
}
