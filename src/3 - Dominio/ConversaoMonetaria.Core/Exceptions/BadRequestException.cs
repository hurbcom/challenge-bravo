namespace ConversaoMonetaria.Dominio.Core.Exceptions;

public class BadRequestException
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; }
}