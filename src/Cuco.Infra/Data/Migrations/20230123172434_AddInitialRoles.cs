using Microsoft.EntityFrameworkCore.Migrations;
using Cuco.Infra.Data.Seeds;

#nullable disable

namespace Cuco.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.GenerateInitialRoles();
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteInitialRoles();
        }
    }
}
