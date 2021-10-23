using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SharedLibrary.Models
{
    [Table("Currencies")]
    public class CurrencyObject
    {
        [Key]
        [Required]
        public string Name              { get; set; }
        public double Price             { get; set; }
        public bool   AutoUpdateRate    { get; set; }
        public bool   DefaultCurrency   { get; set; }
    }
}
