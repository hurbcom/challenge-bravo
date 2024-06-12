using System.ComponentModel.DataAnnotations;

namespace CurrencyConverter.Api.Models
{
    public class CurrencyViewModel
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "The {0} field is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "The {0} field is required")]
        public double QuoteDollarPrice { get; set; }
    }
}
