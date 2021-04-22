namespace CurrencyConverter.Model.Dto
{
    public class CurrencyToConvertDto
    {
        public string From { get; set; }
        public string To { get; set; }
        public double Amount { get; set; }

        public CurrencyToConvertDto()
        {
            //Empty Constructor
        }

        public CurrencyToConvertDto(string from, string to, double amount)
        {
            this.From = from;
            this.To = to;
            this.Amount = amount;
        }
    }
}
