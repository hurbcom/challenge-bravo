using System.ComponentModel.DataAnnotations;

namespace HURB.Application.Model.Request.Quotation
{
    public class QuotationRequest
    {
        [Required(ErrorMessage = "Currency From required.")]
        [MaxLength(4, ErrorMessage = "Currency From max length 4 characters.")]
        public string From { get; set; }

        [Required(ErrorMessage = "Currency To required.")]
        [MaxLength(4, ErrorMessage = "Currency To max length 4 characters.")]
        public string To { get; set; }

        [Required]
        public decimal Amount { get; set; }
    }
}
