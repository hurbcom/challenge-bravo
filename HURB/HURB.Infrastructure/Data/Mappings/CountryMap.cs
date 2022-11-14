using HURB.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HURB.Infrastructure.Data.Mappings
{
    public class CountryMap : IEntityTypeConfiguration<Country>
    {
        public void Configure(EntityTypeBuilder<Country> entity)
        {
            entity.ToTable("Country");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.DisplayName).HasColumnType("varchar(25)").IsRequired();
            entity.Property(e => e.ThreeLetterISORegionName).HasColumnType("varchar(3)").IsRequired();
        }
    }
}
