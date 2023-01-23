using Cuco.Domain.Roles.Models.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;

public static class RoleSeed
{
    internal static void GenerateInitialCurrencies(this MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql(
            $@"
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (1,'ADMIN');
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (2,'SYNC');
            INSERT INTO {nameof(Role)}({nameof(Role.Id)},{nameof(Role.Name)}) VALUES (3,'USER');
          ");
}