using Cuco.Domain.Roles.Models.Enums;
using Cuco.Domain.Users.Extensions;
using Cuco.Domain.Users.Models.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;

internal static class UserSeed
{
    private const string UserFirstPassword = "9DdrS0qILyA!X4Zu5";

    internal static void GenerateInitialUsers(this MigrationBuilder migrationBuilder)
    {
        var adminPassword = UserFirstPassword.Hash();
        migrationBuilder.Sql(
            $@"
            INSERT INTO {nameof(User)}({nameof(User.Id)},{nameof(User.Name)},{nameof(User.Password)},{nameof(User.RoleId)}) VALUES (1,'ADMIN', '{adminPassword}',{RoleId.Admin.GetHashCode()});
          ");
    }

    internal static void DeleteInitialUsers(this MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql
        ($@"
               DELETE FROM {nameof(User)} WHERE {nameof(User.Id)} IN (1, 2, 3, 4, 5);
        ");
    }
}