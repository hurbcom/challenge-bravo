using Cuco.Application.Tests.RedisPingPongs;
using Cuco.Commons;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers.Test;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("ping")]
    [ProducesResponseType(typeof(Result<string>), StatusCodes.Status200OK)]
    public ActionResult Ping()
    {
        return Ok(new Result<string> { Output = "PONG" });
    }

    [HttpGet("redis-pong")]
    [ProducesResponseType(typeof(Result<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult> RedisPongAsync([FromServices] IRedisPing service)
    {
        return Ok(await service.AddPong());
    }

    [HttpGet("redis-ping")]
    [ProducesResponseType(typeof(Result<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult> RedisPingAsync([FromServices] IRedisPing service)
    {
        return Ok(await service.Ping());
    }
}