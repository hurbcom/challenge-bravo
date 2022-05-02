using AutoMapper;
using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Models;
using currency_conversion.web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace currency_conversion.web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IMapper _mapper;

        public CurrencyController(ILogger<CurrencyController> logger, IMapper mapper, ICurrencyRepository currencyRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _currencyRepository = currencyRepository;
        }

        [HttpPost(Name = "insert")]
        public IActionResult Insert([FromBody] CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            _ = _currencyRepository.Create(_mappedInputCurrency);
            return Ok();
        }

        [HttpGet(Name = "get")]
        public IActionResult Get(string code)
        {
            var _mappedOutputCurrency = _mapper.Map<CurrencyDTO>(_currencyRepository.Read(code));
            return Ok(_mappedOutputCurrency);
        }

        [HttpPut(Name = "update")]
        public IActionResult Update([FromBody]CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            _ = _currencyRepository.Update(_mappedInputCurrency);
            return Ok();
        }

        [HttpDelete(Name = "delete")]
        public IActionResult Delete(string code)
        {
            _currencyRepository.Delete(code);
            return Ok();
        }
    }
}