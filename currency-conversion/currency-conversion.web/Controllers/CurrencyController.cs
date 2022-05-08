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
        private readonly IMapper _mapper;
        private readonly ICurrencyRepository _currencyRepository;     

        public CurrencyController(ILogger<CurrencyController> logger, IMapper mapper, ICurrencyRepository currencyRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _currencyRepository = currencyRepository;
        }

        [HttpGet(Name = "get")]
        public IActionResult Get(string? code)
        {
            if (code == null)
            {
                return Ok(_mapper.Map<IEnumerable<CurrencyDTO>>(_currencyRepository.ReadAll()));
            }
            var currency = _currencyRepository.Read(code);
            if (currency == null) return NotFound("Currency not found: " + code);
            var _mappedOutputCurrency = _mapper.Map<CurrencyDTO>(currency);
            return Ok(_mappedOutputCurrency);
        }

        [HttpPost(Name = "insert")]
        public IActionResult Insert([FromBody] CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            var created = _currencyRepository.Create(_mappedInputCurrency);
            if (!created) return BadRequest("Currency could not be saved: Code already exists");
            return Ok("Currency added");
        }

        [HttpPut(Name = "update")]
        public IActionResult Update([FromBody]CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            var updated = _currencyRepository.Update(_mappedInputCurrency);
            if (!updated) return BadRequest("Currency not found: " + currencyDTO.Code);
            return Ok("Currency updated");
        }

        [HttpDelete(Name = "delete")]
        public IActionResult Delete(string code)
        {
            var deleted = _currencyRepository.Delete(code);
            if (!deleted) return BadRequest("Currency not found: " + code);
            return Ok("Currency deleted");
        }
    }
}