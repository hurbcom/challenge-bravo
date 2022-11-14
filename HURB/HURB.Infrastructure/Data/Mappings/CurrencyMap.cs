using HURB.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HURB.Infrastructure.Data.Mappings
{
    internal class CurrencyMap : IEntityTypeConfiguration<Currency>
    {
        public void Configure(EntityTypeBuilder<Currency> entity)
        {
            entity.ToTable("Currency");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.ISOCurrencySymbol).HasColumnType("varchar(4)").IsRequired();
            entity.Property(x => x.CurrencySymbol).HasColumnType("varchar(4)");
        }
    }
}
