using AutoMapper;
using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;
using currency_conversion.Core.Models;
using currency_conversion.web.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace currency_conversion.web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ILogger<CurrencyController> _logger;
        private readonly IMapper _mapper;
        private readonly ICurrencyRepository _currencyRepository;
        private readonly ICurrencyFetch _currencyFetch;

        public CurrencyController(ILogger<CurrencyController> logger, IMapper mapper, ICurrencyRepository currencyRepository, ICurrencyFetch currencyFetch)
        {
            _logger = logger;
            _mapper = mapper;
            _currencyRepository = currencyRepository;
            _currencyFetch = currencyFetch;
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

        [HttpPost(Name = "insert_custom")]
        public IActionResult InsertCustom([FromBody] CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            var created = _currencyRepository.Create(_mappedInputCurrency);
            if (!created) return BadRequest("Currency could not be added: Code already exists");
            return Ok("Currency added");
        }

        [HttpPost("{code}")]
        public async Task<IActionResult> Insert([RegularExpression("^[0-9a-zA-Z]{3,10}$", ErrorMessage = "Field must contain only 0-9 a-z A-Z characters, 3 to 10 characters")] string code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currencyToAdd = await _currencyFetch.FetchCurrencyAsync(code);
            if (currencyToAdd == null) return BadRequest("Currency not supported by exchange provider");
            var created = _currencyRepository.Create(currencyToAdd);
            if (!created) return BadRequest("Currency could not be added: Code already exists");
            return Ok("Currency added");
        }

        [HttpPut(Name = "update_custom")]
        public IActionResult UpdateCustom([FromBody]CurrencyDTO currencyDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var _mappedInputCurrency = _mapper.Map<Currency>(currencyDTO);
            var updated = _currencyRepository.Update(_mappedInputCurrency);
            if (!updated) return NotFound("Currency not found: " + currencyDTO.Code + ", or not eligible for update");
            return Ok("Currency updated");
        }

        [HttpDelete(Name = "delete")]
        public IActionResult Delete([RegularExpression("^[0-9a-zA-Z]{3,10}$", ErrorMessage = "Field must contain only 0-9 a-z A-Z characters, 3 to 10 characters")]string code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var deleted = _currencyRepository.Delete(code);
            if (!deleted) return NotFound("Currency not found: " + code);
            return Ok("Currency deleted");
        }
    }
}