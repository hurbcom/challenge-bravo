using DesafioBravoBackEnd.BO;
using DesafioBravoBackEnd.Data;
using DesafioBravoBackEnd.DTO;
using DesafioBravoBackEnd.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DesafioBravoBackEnd.Controllers
{
    [ApiController]
    [Route(template: "v1")]
    public class MoedaController : ControllerBase
    {
        [HttpGet]
        [Route("moedas")]
        public IActionResult Get([FromServices] AppDbContext context, [FromHeader] string apiKey)
        {
            if (!new AcessoBO().AcessoValido(apiKey))
                return Unauthorized(new CotacaoDTO() { retorno = new RetornoDTO() { sucesso = false, mensagem = "Acesso negado." }, cotacao = null });

            MoedasDTO dto = new MoedaBO(context).Buscar();
            return Ok(dto);
        }

        [HttpPost("moedas")]
        public IActionResult Post([FromServices] AppDbContext context, [FromHeader] string apiKey, [FromBody] MoedaViewModel model)
        {
            if (!new AcessoBO().AcessoValido(apiKey))
                return Unauthorized(new CotacaoDTO() { retorno = new RetornoDTO() { sucesso = false, mensagem = "Acesso negado." }, cotacao = null });

            if (!ModelState.IsValid)
                return BadRequest("JSON de entrada Inválido");
            try
            {
                MoedaDTO dto = new MoedaBO(context).Adicionar(model);
                return Created($"v1/moedas/{dto.moeda.Codigo}", dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("moedas/{codigo}")]
        public IActionResult Delete([FromServices] AppDbContext context, [FromHeader] string apiKey, [FromRoute] string codigo)
        {
            if (!new AcessoBO().AcessoValido(apiKey))
                return Unauthorized(new CotacaoDTO() { retorno = new RetornoDTO() { sucesso = false, mensagem = "Acesso negado." }, cotacao = null });

            try
            {
                MoedaDTO dto = new MoedaBO(context).Remover(codigo);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}