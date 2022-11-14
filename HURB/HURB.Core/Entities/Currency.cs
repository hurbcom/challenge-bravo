using HURB.Core.Entities.Base;

namespace HURB.Core.Entities
{
    public class Currency : Entity
    {
        public string ISOCurrencySymbol { get; set; }
        public string? CurrencySymbol { get; set; }
    }
}