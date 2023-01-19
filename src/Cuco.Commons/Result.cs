namespace Cuco.Commons;

public class Result<TOutput>
{
    public TOutput Output { get; set; }
    public ErrorMessage ErrorMessage { get; set; }
}

public class ErrorMessage
{
}