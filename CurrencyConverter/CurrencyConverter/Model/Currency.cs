using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurrencyConverter.Model
{
    public class Currency
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public string Name { get; set; }
        public decimal ValueComparedToBaseCurrency { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime UpdateDate { get; set; }

        public Currency()
        {
            //Empty Constructor
        }

        public Currency(string name, decimal valueComparedToBaseCurrency, DateTime creationDate, DateTime updateDate)
        {
            this.Name = name;
            this.ValueComparedToBaseCurrency = valueComparedToBaseCurrency;
            this.CreationDate = creationDate;
            this.UpdateDate = updateDate;
        }
    }
}
