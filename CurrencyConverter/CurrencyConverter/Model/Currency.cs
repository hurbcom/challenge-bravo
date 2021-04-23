using System;

namespace CurrencyConverter.Model
{
    public class Currency
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public decimal ValueComparedToBaseCurrency { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime UpdateDate { get; set; }

        public Currency()
        {
            //Empty Constructor
        }

        public Currency(long id, string name, decimal valueComparedToBaseCurrency, DateTime creationDate, DateTime updateDate)
        {
            this.Id = id;
            this.Name = name;
            this.ValueComparedToBaseCurrency = valueComparedToBaseCurrency;
            this.CreationDate = creationDate;
            this.UpdateDate = updateDate;
        }
    }
}
