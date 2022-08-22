using Dapper;
using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DataAccess.Repository;

public interface IConvertionFactorRepository
{}

public class JSONConvertionFactorRepository : IConvertionFactorRepository
{
    private string _path;

    public JSONConvertionFactorRepository(string jsonPath)
    {
        _path = jsonPath;
    }

    public List<SerializableConvertionFactor>? Find(Func<SerializableConvertionFactor, bool> predicate=null)
    {
        var json = File.ReadAllText(_path);
        return JsonSerializer
            .Deserialize<List<SerializableConvertionFactor>>(json)
            ?.Where(predicate != null ? predicate : cf => true)
            ?.ToList();
    }

    public void Save(SerializableConvertionFactor data)
    {
        var db = JsonSerializer.Deserialize<List<SerializableConvertionFactor>>(File.ReadAllText(_path));

        var idx = db.FindIndex(cf => cf.Equals(data));
        if (idx >= 0)
        {
            db.RemoveAt(idx);
        }
        db.Add(data);
        File.WriteAllText(_path, JsonSerializer.Serialize(db, new JsonSerializerOptions { WriteIndented = true}));
    }

    public SerializableConvertionFactor? Remove(SerializableConvertionFactor data)
    {
        var db = JsonSerializer.Deserialize<List<SerializableConvertionFactor>>(File.ReadAllText(_path));

        var idx = db.FindIndex(cf => cf.Equals(data));
        if (idx >= 0)
        {
            var cf = db[idx];
            db.RemoveAt(idx);
            File.WriteAllText(_path, JsonSerializer.Serialize(db, new JsonSerializerOptions { WriteIndented = true }));
            return cf;
        }
        return null;
    }

}

public class ConvertionFactorRepository : IConvertionFactorRepository
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

public class SerializableConvertionFactor : ConvertionFactor
{
    [JsonConstructor]
    public SerializableConvertionFactor(BaseCurrency Currency1, BaseCurrency Currency2, double Factor)
        : base(Currency1, Currency2, Factor)
    {}

    public static SerializableConvertionFactor toSerializable(ConvertionFactor cf)
    {
        return new SerializableConvertionFactor(
            (BaseCurrency) cf.Currency1,
            (BaseCurrency) cf.Currency2,
            cf.Factor
        );
    }
}

