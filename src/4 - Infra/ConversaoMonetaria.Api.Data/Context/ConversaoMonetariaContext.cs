using System;
using System.Threading.Tasks;
using ConversaoMonetaria.Data.EntityConfigurations;
using ConversaoMonetaria.Data.Seeds;
using ConversaoMonetaria.Dominio.Core.Data;
using ConversaoMonetaria.Dominio.Core.Entidades;
using ConversaoMonetaria.Dominio.Entidades.Moedas;
using Microsoft.EntityFrameworkCore;

namespace ConversaoMonetaria.Data.Context;

public class ConversaoMonetariaContext : DbContext, IUnitOfWork
{
    public ConversaoMonetariaContext(DbContextOptions<ConversaoMonetariaContext> options)
        : base(options)
    {
    }

    public DbSet<Moeda> Moedas { get; set; }

    public async Task<int> Commit()
    {
        foreach (var entry in ChangeTracker.Entries())
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Property(nameof(Entidade.DataCadastro)).CurrentValue = DateTime.Now;
                    break;

                case EntityState.Modified:
                    entry.Property(nameof(Entidade.DataCadastro)).IsModified = false;

                    if (entry.Member(nameof(Entidade.DataAtualizacao)) != null)
                        entry.Property(nameof(Entidade.DataAtualizacao)).CurrentValue = DateTime.Now;
                    break;
                case EntityState.Detached:
                    break;
                case EntityState.Unchanged:
                    break;
                case EntityState.Deleted:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

        return await base.SaveChangesAsync();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ConversaoMonetariaContext).Assembly);

        modelBuilder.ApplyConfiguration(new MoedaConfiguration());

        modelBuilder.GerarMoedaSeed();
    }
}