using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ConversaoMonetaria.Dominio.DTO.AntiCorruption.AwesomeApi;

public partial class AwesomeRetorno
{
    [JsonProperty("code")] public string Code { get; set; }

    [JsonProperty("codein")] public Codein Codein { get; set; }

    [JsonProperty("name")] public string Name { get; set; }

    [JsonProperty("high")] public string High { get; set; }

    [JsonProperty("low")] public string Low { get; set; }

    [JsonProperty("varBid")] public string VarBid { get; set; }

    [JsonProperty("pctChange")] public string PctChange { get; set; }

    [JsonProperty("bid")] public string Bid { get; set; }

    [JsonProperty("ask")] public string Ask { get; set; }

    [JsonProperty("timestamp")]
    [JsonConverter(typeof(ParseStringConverter))]
    public long Timestamp { get; set; }

    [JsonProperty("create_date")] public DateTimeOffset CreateDate { get; set; }
}

public enum Codein
{
    Brl,
    Brlt
}

public partial class AwesomeRetorno
{
    public static Dictionary<string, AwesomeRetorno> FromJson(string json)
    {
        return JsonConvert.DeserializeObject<Dictionary<string, AwesomeRetorno>>(json, Converter.Settings);
    }
}

internal static class Converter
{
    public static readonly JsonSerializerSettings Settings = new()
    {
        MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
        DateParseHandling = DateParseHandling.None,
        Converters =
        {
            CodeinConverter.Singleton,
            new IsoDateTimeConverter {DateTimeStyles = DateTimeStyles.AssumeUniversal}
        }
    };
}

internal class CodeinConverter : JsonConverter
{
    public static readonly CodeinConverter Singleton = new();

    public override bool CanConvert(Type t)
    {
        return t == typeof(Codein) || t == typeof(Codein?);
    }

    public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.Null) return null;
        var value = serializer.Deserialize<string>(reader);
        switch (value)
        {
            case "BRL":
                return Codein.Brl;
            case "BRLT":
                return Codein.Brlt;
        }

        throw new Exception("Cannot unmarshal type Codein");
    }

    public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
    {
        if (untypedValue == null)
        {
            serializer.Serialize(writer, null);
            return;
        }

        var value = (Codein) untypedValue;
        switch (value)
        {
            case Codein.Brl:
                serializer.Serialize(writer, "BRL");
                return;
            case Codein.Brlt:
                serializer.Serialize(writer, "BRLT");
                return;
        }

        throw new Exception("Cannot marshal type Codein");
    }
}

internal class ParseStringConverter : JsonConverter
{
    public static readonly ParseStringConverter Singleton = new();

    public override bool CanConvert(Type t)
    {
        return t == typeof(long) || t == typeof(long?);
    }

    public override object ReadJson(JsonReader reader, Type t, object existingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.Null) return null;
        var value = serializer.Deserialize<string>(reader);
        long l;
        if (long.TryParse(value, out l)) return l;
        throw new Exception("Cannot unmarshal type long");
    }

    public override void WriteJson(JsonWriter writer, object untypedValue, JsonSerializer serializer)
    {
        if (untypedValue == null)
        {
            serializer.Serialize(writer, null);
            return;
        }

        var value = (long) untypedValue;
        serializer.Serialize(writer, value.ToString());
    }
}