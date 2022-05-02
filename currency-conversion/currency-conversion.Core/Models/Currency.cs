using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace currency_conversion.Core.Models
{
    [Table("currency")]
    public class Currency : BaseEntity
    {
        [Key]
        [Column("code")]
        public string? Code { get; set; }
        [Column("name")]
        public string? Name { get; set; }
        [Column("rate")]
        public double Rate { get; set; }

    }
}
