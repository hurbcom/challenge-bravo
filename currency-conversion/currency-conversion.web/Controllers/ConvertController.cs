using AutoMapper;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace currency_conversion.web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConvertController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly IMapper _mapper;
        private readonly IConvertService _convertService;

        public ConvertController(ILogger<CurrencyController> logger, IMapper mapper, IConvertService convertService)
        {
            _logger = logger;
            _mapper = mapper;
            _convertService = convertService;
        }

        [HttpGet(Name = "convert")]
        public IActionResult Convert([FromQuery]ConvertDTO convertDTO)
        {
            double value;
            try
            {
                value = _convertService.Convert(convertDTO.From, convertDTO.To, convertDTO.Amount);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(value);
        }
    }
}
