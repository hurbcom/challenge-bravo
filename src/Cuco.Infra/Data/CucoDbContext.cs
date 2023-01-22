using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace Cuco.Infra.Data;

public class CucoDbContext : DbContext
{
    public CucoDbContext(DbContextOptions<CucoDbContext> options) : base(options)  { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)  { }
}