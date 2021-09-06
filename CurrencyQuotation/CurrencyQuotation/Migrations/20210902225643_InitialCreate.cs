using Microsoft.EntityFrameworkCore.Migrations;
using System;

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
                    name = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    dolar_amount = table.Column<decimal>(type: "decimal(22,10)", precision: 22, scale: 10, nullable: false),
                    creation_date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    last_update = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_currency", x => x.id);
                    table.UniqueConstraint("Unique_name", x => x.name);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "currency");
        }
    }
}
