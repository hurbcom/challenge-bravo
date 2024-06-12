
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace CurrencyConverter.WebApp.MVC.Models;

public class CurrencyConverterViewModel
{
    [Required(ErrorMessage = "The {0} field is required")]
    public string From { get; set; }

    [Required(ErrorMessage = "The {0} field is required")]
    public string To { get; set; }

    [Required(ErrorMessage = "The {0} field is required")]
    public double Amount { get; set; }

    public double Result { get; set; }

    public bool Validate(CurrencyConverterViewModel currencyConverterViewModel)
    {
        if(currencyConverterViewModel.From == currencyConverterViewModel.To ||
            currencyConverterViewModel.To == currencyConverterViewModel.From)
        {
            throw new Exception("Select different currencies");
        }

        return true;
    }
}
