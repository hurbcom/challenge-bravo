using HURB.Core.Entities.Base;

namespace HURB.Core.Entities
{
    public class QuotationCurrency : Entity
    {
        public Guid CountryId { get; set; }
        public Guid CurrencyId { get; set; }
        public decimal Value { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        #region NAVIGATION PROPERTIES

        public virtual Country Country { get; set; }
        public virtual Currency Currency { get; set; }

        #endregion
    }
}