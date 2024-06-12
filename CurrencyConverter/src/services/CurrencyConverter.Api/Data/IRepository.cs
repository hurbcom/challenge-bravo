namespace CurrencyConverter.Api.Data
{
    public interface IRepository<T>
    {
        Task<List<T>> GetAsync();
        Task<T?> GetAsync(string id);
        Task<T?> CreateAsync(T entity);
        Task UpdateAsync(string id, T entity);
        Task RemoveAsync(string id);
    }
}
