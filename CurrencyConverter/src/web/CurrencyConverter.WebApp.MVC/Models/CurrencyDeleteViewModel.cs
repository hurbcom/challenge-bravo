
using System.ComponentModel.DataAnnotations;

namespace CurrencyConverter.WebApp.MVC.Models;

public class CurrencyDeleteViewModel
{
    [Required(ErrorMessage = "The {0} field is required")]
    public string Code { get; set; }
}
