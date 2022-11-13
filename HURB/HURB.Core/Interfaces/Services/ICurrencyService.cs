using HURB.Core.Entities;

namespace HURB.Core.Interfaces.Services
{
    public interface ICurrencyService
    {
        Task AddAsync(Currency entity);
        Task<Currency> UpdateAsync(Currency entity);
    }
}
