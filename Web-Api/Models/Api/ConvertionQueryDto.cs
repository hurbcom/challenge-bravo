namespace Web_Api.Models.Api;

public interface IConvertionQueryDto
{
    public string from { get; set; }
    public string to { get; set; }
    public decimal amount { get; set; }
     
}

public class ConvertionQueryDto
{
    public string from { get; set; }
    public string to { get; set; }
    public decimal amount { get; set; }
     
}