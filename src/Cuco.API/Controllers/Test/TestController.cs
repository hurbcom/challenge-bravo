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
}