namespace Cuco.Commons.Base;

public interface IRepository<TEntity> where TEntity : Entity
{
    Task<TEntity> GetAsync(long id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task AddAsync(TEntity entity);
    Task DeleteAsync(long id);
}