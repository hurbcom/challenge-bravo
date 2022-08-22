namespace DataAccess;

using System.Data;
using System.Data.SqlClient;
using Dapper;

public interface IDapperSqlConnection
{}

public class DapperSqlConnection : IDapperSqlConnection
{

    public SqlConnection Connection {get;}

    public DapperSqlConnection(string connectionString) 
    {
        Connection = new SqlConnection(connectionString);
    }

    public void Open()
    {
        Connection.Open();
    }

    public void Close()
    {
        Connection.Close();
    }
}