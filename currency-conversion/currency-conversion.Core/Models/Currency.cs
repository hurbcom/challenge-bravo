namespace currency_conversion.Core.Models
{
    public class Currency : BaseEntity
    {
        public int Code { get; set; }
        public string? Name { get; set; }
        public double Rate { get; set; }

    }
}
