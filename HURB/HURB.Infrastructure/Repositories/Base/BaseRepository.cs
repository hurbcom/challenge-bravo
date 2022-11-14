using HURB.Core.Entities.Base;
using HURB.Core.Interfaces.Repositories.Base;
using HURB.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace HURB.Infrastructure.Repositories.Base
{
    public abstract class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : Entity
    {
        private readonly HURBContext _context;
        private readonly DbSet<TEntity> _dbSet;
        protected bool Disposed { get; private set; } = false;
        private IDbContextTransaction _transaction;

        protected BaseRepository(HURBContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public async Task OpenTransactionAsync()
        {
            _transaction ??= await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            try
            {
                await _context.SaveChangesAsync();

                if (_transaction != null)
                    await _transaction?.CommitAsync();
            }
            catch (Exception ex)
            {
                if (_transaction != null)
                    await _transaction?.RollbackAsync();

                throw;
            }
        }

        public virtual async Task AddAsync(TEntity entity)
            => await _context.AddAsync(entity);

        public virtual async Task<TEntity> InsertAsync(TEntity entity)
        {
            var createdEntity = await _dbSet.AddAsync(entity);

            return createdEntity.Entity;
        }

        public virtual async Task InsertAsync(IEnumerable<TEntity> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;

            return await Task.FromResult(entity);
        }

        public virtual Task UpdateAsync(IEnumerable<TEntity> entities)
        {
            _dbSet.AttachRange(entities);
            _context.Entry(entities).State = EntityState.Modified;

            return Task.CompletedTask;
        }

        public virtual async Task DeleteAsync(object id)
        {
            var result = await _dbSet.FindAsync(id);
            _dbSet.Remove(result);
        }

        public virtual Task DeleteAsync(TEntity entity)
        {
            _dbSet.Remove(entity);

            return Task.CompletedTask;
        }

        public virtual Task DeleteAsync(IEnumerable<TEntity> entities)
        {
            _dbSet.RemoveRange(entities);

            return Task.CompletedTask;
        }

        public virtual void Detach()
            => _context.ChangeTracker.Clear();

        public async Task<IQueryable<TEntity>> FilterAsync()
            => await Task.FromResult(_context.Set<TEntity>());

        public async Task<IQueryable<TEntity>> FilterAsync(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                                          bool useQuerySplit = false)
        {
            var query = await this.FilterAsync();

            if (include != null)
                query = include(query);

            if (useQuerySplit)
                query = query.AsSplitQuery();

            return query;
        }

        public async Task<IQueryable<TEntity>> FilterAsNoTrackingAsync()
            => await Task.FromResult(_context.Set<TEntity>()
                       .AsNoTracking());

        public async Task<IQueryable<TEntity>> FilterAsNoTrackingAsync(Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                                                      bool useQuerySplit = false)
        {
            var query = await this.FilterAsNoTrackingAsync();

            if (include != null)
                query = include(query);

            if (useQuerySplit)
                query = query.AsSplitQuery();

            return query;
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> filter = null)
        {
            var query = _dbSet;

            return await query.AnyAsync(filter);
        }

        public virtual async Task<TEntity> GetByIdAsync(Guid id)
            => await _dbSet.FindAsync(id);

        public async Task<TEntity> GetByIdNoTrackingAsync(Guid id)
        {
            var query = await FilterAsNoTrackingAsync();

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TEntity> GetByIdAsync(Guid id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include, bool useQuerySplit = false)
        {
            var query = await FilterAsNoTrackingAsync(include, useQuerySplit);

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TEntity> GetByIdNoTrackingAsync(Guid id, Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include, bool useQuerySplit = false)
        {
            var query = await FilterAsNoTrackingAsync(include, useQuerySplit);

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> filter)
        {
            IQueryable<TEntity> query = _dbSet;

            return await query.SingleAsync(filter);
        }

        public async Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> filter)
        {
            IQueryable<TEntity> query = _dbSet;

            return await query.SingleOrDefaultAsync(filter);
        }

        public async Task<int> CountAsync()
            => await _dbSet.CountAsync();

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>> filter)
            => await _dbSet.CountAsync(filter);

        public void Dispose()
        {
            Dispose(true);

            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (Disposed) return;

            if (disposing)
            {
                _transaction?.Dispose();
                _context.Dispose();
            }

            Disposed = true;
        }
    }
}
