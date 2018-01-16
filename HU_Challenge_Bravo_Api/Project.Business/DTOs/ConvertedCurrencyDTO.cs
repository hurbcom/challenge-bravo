using System;

namespace Project.Business.DTOs
{
    public class ConvertedCurrencyDTO
    {
        public string From_Currency { get; set; }
        public string To_Currency { get; set; }
        public decimal Orinigal_Value { get; set; }
        public decimal Converted_Value { get; set; }
        public string Quotation_Last_Update { get; set; }
    }
}
