using Cuco.Commons.Settings;
using Cuco.Domain.Roles.Models.Enums;
using Cuco.Domain.Users.Models.Entities;
using Cuco.Domain.Users.Services.Extensions;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;

internal class UserSeed
{
    private readonly SecuritySettings _securitySettings;

    public UserSeed(SecuritySettings securitySettings)
    {
        _securitySettings = securitySettings;
    }

    internal void GenerateInitialCurrencies(MigrationBuilder migrationBuilder)
    {
        var adminPassword = _securitySettings.AdminPassword.Hash();
        var syncUserPassword = _securitySettings.SyncUserPassword.Hash();
        migrationBuilder.Sql(
            $@"
            INSERT INTO {nameof(User)}({nameof(User.Name)},{nameof(User.Password)},{nameof(User.Role)}) VALUES ({_securitySettings.AdminName}, {adminPassword},{RoleId.Admin});
            INSERT INTO {nameof(User)}({nameof(User.Name)},{nameof(User.Password)},{nameof(User.Role)}) VALUES ({_securitySettings.SyncUserName},{syncUserPassword},{RoleId.Sync});
          ");
    }
}