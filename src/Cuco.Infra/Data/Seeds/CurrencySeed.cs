using Cuco.Domain.Currencies.Models.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Cuco.Infra.Data.Seeds;
internal static class CurrencySeed
{
    internal static void GenerateInitialCurrencies(this MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql(
        $@"
            INSERT INTO {nameof(Currency)}({nameof(Currency.Symbol)}, {nameof(Currency.Name)}, {nameof(Currency.ValueInDollar)}, {nameof(Currency.Available)}, {nameof(Currency.LastUpdateAt)}) VALUES ('usd', 'Dollar',   1, TRUE, '9999-12-31');
            INSERT INTO {nameof(Currency)}({nameof(Currency.Symbol)}, {nameof(Currency.Name)}, {nameof(Currency.ValueInDollar)}, {nameof(Currency.Available)}, {nameof(Currency.LastUpdateAt)}) VALUES ('brl', 'Real',     0, TRUE, '1000-01-01');
            INSERT INTO {nameof(Currency)}({nameof(Currency.Symbol)}, {nameof(Currency.Name)}, {nameof(Currency.ValueInDollar)}, {nameof(Currency.Available)}, {nameof(Currency.LastUpdateAt)}) VALUES ('eur', 'Euro',     0, TRUE, '1000-01-01');
            INSERT INTO {nameof(Currency)}({nameof(Currency.Symbol)}, {nameof(Currency.Name)}, {nameof(Currency.ValueInDollar)}, {nameof(Currency.Available)}, {nameof(Currency.LastUpdateAt)}) VALUES ('btc', 'Bitcoin',  0, TRUE, '1000-01-01');
            INSERT INTO {nameof(Currency)}({nameof(Currency.Symbol)}, {nameof(Currency.Name)}, {nameof(Currency.ValueInDollar)}, {nameof(Currency.Available)}, {nameof(Currency.LastUpdateAt)}) VALUES ('eth', 'Ethereum', 0, TRUE, '1000-01-01');

          ");

    internal static void DeleteInitialCurrencies(this MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql
        ($@"
               DELETE FROM {nameof(Currency)} WHERE {nameof(Currency.Symbol)} IN ('usd', 'brl', 'eur', 'btc', 'eth');
        ");
}





