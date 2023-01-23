using Microsoft.EntityFrameworkCore.Migrations;
using Cuco.Infra.Data.Seeds;

#nullable disable

namespace Cuco.Infra.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.GenerateInitialUsers();
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.GenerateInitialUsers();
        }
    }
}
