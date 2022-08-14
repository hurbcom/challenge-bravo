// See https://aka.ms/new-console-template for more information
using DataAccess;
using DataAccess.Repository;

Console.WriteLine("Hello, World!");

var conn = new DapperSqlConnection("Server=localhost;Database=challenge-bravo;User Id=sa;Password=P@ssw0rd;");
var repo = new ConvertionFactorRepository(conn);
repo.FindById(1);



;// var summary = BenchmarkRunner.Run<Sleeps>(null, args);