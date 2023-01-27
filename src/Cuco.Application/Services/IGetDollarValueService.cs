namespace Cuco.Application.Services;

public interface IGetDollarValueService
{
    Task<decimal[]> Convert(string[] symbols);
}