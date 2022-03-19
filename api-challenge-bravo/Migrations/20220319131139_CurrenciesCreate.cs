using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace api_challenge_bravo.Migrations
{
    public partial class CurrenciesCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currencies",
                columns: table => new
                {
                    Symbol = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    ExchangeRateInUSD = table.Column<decimal>(nullable: false),
                    AutoUpdateExchangeRate = table.Column<bool>(nullable: false),
                    LastTimeUpdatedExchangeRate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.Symbol);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currencies");
        }
    }
}
