using System.ComponentModel.DataAnnotations;

namespace currency_conversion.web.DTOs
{
    public class ConvertDTO
    {
        [Required]
        [RegularExpression("^[0-9a-zA-Z]{3,10}$", ErrorMessage = "Field must contain only 0-9 a-z A-Z characters, 3 to 10 characters")]
        public string From { get; set; } = "";
        [Required]
        [RegularExpression("^[0-9a-zA-Z]{3,10}$", ErrorMessage = "Field must contain only 0-9 a-z A-Z characters, 3 to 10 characters")]
        public string To { get; set; } = "";
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Only positive number allowed")]
        public double Amount { get; set; }
    }
}
