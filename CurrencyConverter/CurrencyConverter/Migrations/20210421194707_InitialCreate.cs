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
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValueComparedToDollar = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Currency",
                columns: new[] { "Id", "Name", "ValueComparedToDollar" },
                values: new object[,]
                {
                    { 1L, "USD", 1.0 },
                    { 2L, "BRL", 6.0 },
                    { 3L, "EUR", 0.5 },
                    { 4L, "BTC", 100000.0 },
                    { 5L, "ETH", 20000.0 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currency");
        }
    }
}
