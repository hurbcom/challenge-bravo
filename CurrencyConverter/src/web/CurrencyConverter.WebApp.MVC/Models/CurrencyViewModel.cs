using System.ComponentModel.DataAnnotations;

namespace CurrencyConverter.WebApp.MVC.Models
{
    public class CurrencyViewModel
    {
        [Required(ErrorMessage = "The {0} field is required")]
        public string Code { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The {0} field is required")]
        [Display(Name = "Quote dollar price")]
        public double QuoteDollarPrice { get; set; }
    }
}
