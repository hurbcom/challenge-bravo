namespace Web_Api.Models.Currency.Convertion;

public interface IConvertionDto
{
        string From { get; set; }
        string To { get; set;}
        double Factor { get; set; }
        decimal Result {get; set;}
}
public class ConvertionDto : IConvertionDto
{
        public string From { get; set; }
        public string To { get; set;}
        public double Factor { get; set; }
        public decimal Result {get; set;}
}