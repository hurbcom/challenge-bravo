using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurrencyQuotation.Models
{
    [Table("currency")]
    public class Currency
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("dolar_amount")]
        public decimal DolarAmount { get; set; }

        [Column("creation_date")]
        public DateTime CreationDate { get; set; }

        [Column("last_update")]
        public DateTime LastUpdate { get; set; }

        public Currency(string name, decimal dolarAmount)
        {
            this.Name = name;
            this.DolarAmount = dolarAmount;
            this.CreationDate = DateTime.Now;
            this.LastUpdate = DateTime.Now;
        }
    }
}
