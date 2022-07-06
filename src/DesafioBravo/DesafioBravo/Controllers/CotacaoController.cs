using DesafioBravo.BO;
using DesafioBravo.Data;
using DesafioBravo.DTO;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DesafioBravo.Controllers
{
    [ApiController]
    [Route(template: "v1")]
    public class CotacaoController : ControllerBase
    {
        [HttpGet]
        [Route("cotacao")]
        public IActionResult GetAmount([FromServices] AppDbContext context, [FromHeader] string apiKey, [FromQuery] string from, [FromQuery] string to, [FromQuery] string amount)
        {
            try
            {
                if (!new AcessoBO().AcessoValido(apiKey))
                    return Unauthorized(new CotacaoDTO() { retorno = new RetornoDTO() { sucesso = false, mensagem = "Acesso negado." }, cotacao = null });

                return Ok(new CotacaoBO(context).Buscar( from, to, amount));
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
