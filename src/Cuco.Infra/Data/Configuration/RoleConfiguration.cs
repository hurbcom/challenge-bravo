using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Roles.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cuco.Infra.Data.Configuration;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable(nameof(Role));

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Name)
            .HasMaxLength(50);
    }
}