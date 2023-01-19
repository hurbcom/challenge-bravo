namespace Cuco.Application.Tests;

public interface IRedisPing
{
    Task AddPong();
    Task<string> Ping();
}