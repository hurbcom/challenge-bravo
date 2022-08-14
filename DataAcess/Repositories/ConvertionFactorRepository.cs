namespace DataAccess.Repository;

using Dapper;

using Data.Models.Currency.Convertion;

public class ConvertionFactorRepository
{
    private DapperSqlConnection _connection;
    public ConvertionFactorRepository(IDapperSqlConnection connection)
    {
        _connection = (DapperSqlConnection) connection;
    }
    public void FindById(int id)
    {
        _connection.Open();
        var res =_connection.Connection.Query<ConvertionFactor[]>("SELECT * FROM ConvertionFactor");
        _connection.Close();
    }
}

