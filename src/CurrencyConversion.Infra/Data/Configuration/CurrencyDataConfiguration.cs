using CurrencyConversion.Domain.CurrenciesData.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CurrencyConversion.Infra.Data.Configuration;
internal class CurrencyDataConfiguration : IEntityTypeConfiguration<CurrencyData>
{
    public void Configure(EntityTypeBuilder<CurrencyData> builder)
    {
        builder.ToTable(nameof(CurrencyData));

        builder.HasKey(c => c.Id);

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
