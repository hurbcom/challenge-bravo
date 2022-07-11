using ConversaoMonetaria.Dominio.Entidades.Moedas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ConversaoMonetaria.Data.EntityConfigurations;

public class MoedaConfiguration : IEntityTypeConfiguration<Moeda>
{
    public void Configure(EntityTypeBuilder<Moeda> builder)
    {
        // SQLite não suporta Schemas
        // builder.ToTable("Moeda", Schemas.Configuracoes);
        builder.ToTable("Moeda");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Codigo).IsRequired();
        builder.Property(p => p.Cotacao).IsRequired();
        builder.Property(p => p.Nome).IsRequired();
        builder.Property(p => p.Status).IsRequired();
    }
}