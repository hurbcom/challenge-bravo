using Cuco.Commons;
using Cuco.Commons.Base;
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

    [HttpGet("redis-ping")]
    [ProducesResponseType(typeof(Result<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult> RedisPing([FromServices] IRedisCache service)
    {
        await service.SetAsync("ping", "pong");
        return Ok(await service.GetAsync("ping"));
    }
}