// See https://aka.ms/new-console-template for more information
using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using DataAccess;
using DataAccess.Repository;
using System.Text.Json;
using System.Text.Json.Serialization;

Console.WriteLine("Hello, World!");

//var conn = new DapperSqlConnection("Server=localhost;Database=challenge-bravo;User Id=sa;Password=P@ssw0rd;");
//var repo = new ConvertionFactorRepository(conn);
//repo.FindById(1);

// var summary = BenchmarkRunner.Run<Sleeps>(null, args);

//var l = new List<ConvertionFactor>();
//l.Add(new ConvertionFactor(new BaseCurrency { Coin = "USD" }, new BaseCurrency { Coin = "BRL" }, 1 / 5.0));
//l.Add(new ConvertionFactor(new BaseCurrency { Coin = "USD" }, new BaseCurrency { Coin = "EUR" }, 1 / 1.5));
//l.Add(new ConvertionFactor(new BaseCurrency { Coin = "EUR" }, new BaseCurrency { Coin = "BRL" }, 1 / 6.0));


//var s = JsonSerializer.Serialize(l);

var repo = new JSONConvertionFactorRepository(@"C:\Projetos\challenge-bravo\Benchmark\db.json");
var u = repo.Find();
repo.Save(SerializableConvertionFactor.toSerializable(new ConvertionFactor(new BaseCurrency { Coin = "ADA" }, new BaseCurrency { Coin = "BTC" }, 1002)));
