using HURB.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HURB.Infrastructure.Data.Mappings
{
    internal class QuotationCurrencyMap : IEntityTypeConfiguration<QuotationCurrency>
    {
        public void Configure(EntityTypeBuilder<QuotationCurrency> entity)
        {
            entity.ToTable("QuotationCurrency");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.CurrencyId).IsRequired();
            entity.Property(x => x.CurrencyId).IsRequired();
            entity.Property(x => x.Value).HasColumnType("decimal(16,8)").IsRequired();
            entity.Property(x => x.StartDate).IsRequired();
            entity.Property(x => x.EndDate);

            entity.HasOne(x => x.Country);
            entity.HasOne(x => x.Currency);
        }
    }
}
