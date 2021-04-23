using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CurrencyConverter.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currency",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ValueComparedToBaseCurrency = table.Column<decimal>(type: "decimal(22,10)", precision: 22, scale: 10, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Currency",
                columns: new[] { "Id", "CreationDate", "Name", "UpdateDate", "ValueComparedToBaseCurrency" },
                values: new object[,]
                {
                    { 1L, new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), "USD", new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), 1.00m },
                    { 2L, new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), "BRL", new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), 5.4468m },
                    { 3L, new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), "EUR", new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), 0.8324m },
                    { 4L, new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), "BTC", new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), 0.0000180180m },
                    { 5L, new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), "ETH", new DateTime(2021, 4, 22, 19, 56, 28, 498, DateTimeKind.Local).AddTicks(7010), 0.0003784925m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Currency_Name",
                table: "Currency",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currency");
        }
    }
}
