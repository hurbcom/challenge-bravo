namespace Cuco.Application.Tests.RedisPingPongs;

public interface IRedisPing
{
    Task<bool> AddPong();
    Task<string> Ping();
}