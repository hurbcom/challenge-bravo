using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Data;

namespace HURB.Infrastructure.Data
{
    public class HURBContext : DbContext
    {
        public HURBContext(DbContextOptions<HURBContext> options) : base(options)
            => this.ChangeTracker.LazyLoadingEnabled = false;

        public IDbConnection DbConnection
           => this.Database.GetDbConnection();

        public string ConnectionString
           => this.Database.GetDbConnection().ConnectionString;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            RemoveEntityDeleteCascade(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(HURBContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }

        #region PRIVATE METHODS

        private static void RemoveEntityDeleteCascade(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }

        #endregion PRIVATE METHODS
    }

    public class RDOContextFactory : IDesignTimeDbContextFactory<HURBContext>
    {
        public HURBContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<HURBContext>();
            optionsBuilder.UseSqlServer(@"Server=localhost,1433;Database=PS;User Id=sa;Password=P@ssword!");

            return new HURBContext(optionsBuilder.Options);
        }
    }
}
