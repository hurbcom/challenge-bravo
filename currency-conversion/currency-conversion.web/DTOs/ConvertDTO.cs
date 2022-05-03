using System.ComponentModel.DataAnnotations;

namespace currency_conversion.web.DTOs
{
    public class ConvertDTO
    {
        [Required]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "Field must contain only a-z A-Z characters")]
        public string From { get; set; } = "";
        [Required]
        [RegularExpression("^[a-zA-Z]+$", ErrorMessage = "Field must contain only a-z A-Z characters")]
        public string To { get; set; } = "";
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Only positive number allowed")]
        public double Amount { get; set; }
    }
}
