namespace Cuco.Application.Services;

public interface IConvertToDollarService
{
    Task<decimal[]> Convert(string[] symbols);
}