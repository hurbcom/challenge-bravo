using Cuco.Domain.CurrenciesData.Models.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;
internal static class CurrencyDataSeed
{
    internal static void GenerateInitialCurrencies(this MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql(
        $@"
            INSERT INTO {nameof(CurrencyData)}({nameof(CurrencyData.Symbol)}, {nameof(CurrencyData.Name)}, {nameof(CurrencyData.ValueInDollar)}, {nameof(CurrencyData.Available)}, {nameof(CurrencyData.LastUpdateAt)}) VALUES ('usd', 'Dollar',   1, TRUE, '9999-12-31');
            INSERT INTO {nameof(CurrencyData)}({nameof(CurrencyData.Symbol)}, {nameof(CurrencyData.Name)}, {nameof(CurrencyData.ValueInDollar)}, {nameof(CurrencyData.Available)}, {nameof(CurrencyData.LastUpdateAt)}) VALUES ('brl', 'Real',     0, TRUE, '1000-01-01');
            INSERT INTO {nameof(CurrencyData)}({nameof(CurrencyData.Symbol)}, {nameof(CurrencyData.Name)}, {nameof(CurrencyData.ValueInDollar)}, {nameof(CurrencyData.Available)}, {nameof(CurrencyData.LastUpdateAt)}) VALUES ('eur', 'Euro',     0, TRUE, '1000-01-01');
            INSERT INTO {nameof(CurrencyData)}({nameof(CurrencyData.Symbol)}, {nameof(CurrencyData.Name)}, {nameof(CurrencyData.ValueInDollar)}, {nameof(CurrencyData.Available)}, {nameof(CurrencyData.LastUpdateAt)}) VALUES ('btc', 'Bitcoin',  0, TRUE, '1000-01-01');
            INSERT INTO {nameof(CurrencyData)}({nameof(CurrencyData.Symbol)}, {nameof(CurrencyData.Name)}, {nameof(CurrencyData.ValueInDollar)}, {nameof(CurrencyData.Available)}, {nameof(CurrencyData.LastUpdateAt)}) VALUES ('eth', 'Ethereum', 0, TRUE, '1000-01-01');

          ");

    internal static void DeleteInitialCurrencies(this MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql
        ($@"
               DELETE FROM {nameof(CurrencyData)} WHERE {nameof(CurrencyData.Symbol)} IN ('usd', 'brl', 'eur', 'btc', 'eth');
        ");
}





