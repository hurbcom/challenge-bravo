using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace currency_conversion.Core.Models
{
    [Table("currency")]
    public class Currency : BaseEntity
    {
        [Key]
        [Column("code")]
        public string Code { get; set; }
        [Column("rate")]
        public double? Rate { get; set; }
        [Column("custom")]
        public bool Custom { get; set; }

    }
}
