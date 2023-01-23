namespace Cuco.Commons.Base;

public interface IRepository<TEntity> where TEntity : Entity
{
    Task<TEntity> GetAsync(long id);
    Task<TEntity> GetAsNoTrackingAsync(long id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<IEnumerable<TEntity>> GetAllAsNoTrackingAsync();
    Task AddAsync(TEntity entity);
    Task DeleteAsync(long id);
}