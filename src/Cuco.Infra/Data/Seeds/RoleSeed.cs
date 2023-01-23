using Cuco.Domain.Roles.Models.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;

internal static class RoleSeed
{
    internal static void GenerateInitialRoles(this MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            $@"
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (1,'ADMIN');
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (2,'SYNC');
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (3,'USER');
          ");
    }

    internal static void DeleteInitialRoles(this MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql
        ($@"
               DELETE FROM {nameof(Role)} WHERE {nameof(Role.Id)} IN (1, 2, 3);
        ");
    }
}