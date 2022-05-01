using System.ComponentModel.DataAnnotations;

namespace currency_conversion.web.DTOs
{
    public class CurrencyDTO
    {
        [Required]
        //[StringLength(3, MinimumLength = 3, ErrorMessage = "Field must be 3 characters")]
        [RegularExpression("^[a-zA-Z]$", ErrorMessage = "Field must contain only a-z A-Z characters")]
        public string? Code { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Only positive number allowed")]
        public double Rate { get; set; }
    }
}
