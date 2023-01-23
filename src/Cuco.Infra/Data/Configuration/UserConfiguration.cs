using Cuco.Domain.Users.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cuco.Infra.Data.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable(nameof(User));

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(c => c.Password)
            .IsRequired();
    }
}