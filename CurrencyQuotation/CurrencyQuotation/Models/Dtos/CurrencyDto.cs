using System.ComponentModel.DataAnnotations;

namespace CurrencyQuotation.Models.Dtos
{
    public class CurrencyDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string BaseQuotation { get; set; }
    }
}
