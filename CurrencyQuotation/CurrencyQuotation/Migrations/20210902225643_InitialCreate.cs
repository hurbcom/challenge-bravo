using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CurrencyQuotation.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "currency",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dolar_amount = table.Column<decimal>(type: "decimal(22,10)", precision: 22, scale: 10, nullable: false),
                    creation_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    last_update = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_currency", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "currency");
        }
    }
}
