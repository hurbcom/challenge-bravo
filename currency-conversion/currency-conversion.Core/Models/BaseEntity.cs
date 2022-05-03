using System.ComponentModel.DataAnnotations.Schema;

namespace currency_conversion.Core.Models
{
    public class BaseEntity
    {
        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
