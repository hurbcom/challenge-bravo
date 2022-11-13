using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace HURB.Core.Interfaces.Repositories.Base
{
    public interface IBaseRepository<TEntity> : IDisposable
         where TEntity : class
    {
        Task OpenTransactionAsync();

        Task CommitAsync();

        Task<TEntity> InsertAsync(TEntity entity);

        Task InsertAsync(IEnumerable<TEntity> entities);

        Task<TEntity> UpdateAsync(TEntity entity);

        Task UpdateAsync(IEnumerable<TEntity> entities);

        Task DeleteAsync(object id);

        Task DeleteAsync(TEntity entity);

        Task DeleteAsync(IEnumerable<TEntity> entities);

        Task<IQueryable<TEntity>> FilterAsync(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include,
                                              bool useQuerySplit = false);

        Task<IQueryable<TEntity>> FilterAsNoTrackingAsync(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
                                                          bool useQuerySplit = false);

        Task<TEntity> GetByIdAsync(Guid id);

        Task<TEntity> GetByIdNoTrackingAsync(Guid id);

        Task<TEntity> GetByIdAsync(Guid id,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    bool useQuerySplit = false);

        Task<TEntity> GetByIdNoTrackingAsync(Guid id,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
            bool useQuerySplit = false);

        Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> filter);

        Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> filter);

        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> filter);

        Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter);
    }
}
