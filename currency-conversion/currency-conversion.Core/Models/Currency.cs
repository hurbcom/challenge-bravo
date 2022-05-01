using System.ComponentModel.DataAnnotations;

namespace currency_conversion.Core.Models
{
    public class Currency : BaseEntity
    {
        [Key]
        public string Code { get; set; }
        public string? Name { get; set; }
        public double Rate { get; set; }

    }
}
