using Cuco.Domain.Currencies.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cuco.Infra.Data.Configuration;
internal class CurrencyDataConfiguration : IEntityTypeConfiguration<Currency>
{
    public void Configure(EntityTypeBuilder<Currency> builder)
    {
        builder.ToTable(nameof(Currency));

        builder.HasIndex(c => c.Symbol)
               .IsUnique();
        builder.Property(c => c.Symbol)
               .IsRequired()
               .HasMaxLength(10);

        builder.Property(c => c.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(c => c.ValueInDollar)
               .IsRequired();
    }
}
