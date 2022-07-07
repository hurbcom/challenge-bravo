using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConversaoMonetaria.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Moeda",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Codigo = table.Column<string>(type: "TEXT", nullable: false),
                    Cotacao = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Moeda", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Moeda",
                columns: new[] { "Id", "Codigo", "Cotacao", "DataAtualizacao", "DataCadastro", "Nome", "Status" },
                values: new object[] { 1, "BRL", 5.4125m, new DateTime(2022, 7, 7, 9, 42, 26, 750, DateTimeKind.Local).AddTicks(2618), new DateTime(2022, 7, 7, 9, 42, 26, 750, DateTimeKind.Local).AddTicks(2626), "Real Brasileiro", 0 });

            migrationBuilder.InsertData(
                table: "Moeda",
                columns: new[] { "Id", "Codigo", "Cotacao", "DataAtualizacao", "DataCadastro", "Nome", "Status" },
                values: new object[] { 2, "USD", 1m, new DateTime(2022, 7, 7, 9, 42, 26, 750, DateTimeKind.Local).AddTicks(2631), new DateTime(2022, 7, 7, 9, 42, 26, 750, DateTimeKind.Local).AddTicks(2631), "Dólar Americano", 0 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Moeda");
        }
    }
}
