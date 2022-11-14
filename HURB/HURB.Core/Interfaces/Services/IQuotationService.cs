namespace HURB.Core.Interfaces.Services
{
    public interface IQuotationService
    {
        Task<string> GetQuotation(string from, string to, decimal amount);
    }
}
