using HURB.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HURB.Infrastructure.Data.Mappings
{
    public class UserMap : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {
            entity.ToTable("User");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name).HasColumnType("varchar(30)").IsRequired();
            entity.Property(e => e.Profile).IsRequired();
        }
    }
}
