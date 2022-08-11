using CurrencyConverterAPI.Application.AppServices;
using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.DTO;
using CurrencyConverterAPI.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Polly.CircuitBreaker;
using StackExchange.Redis;
using System.Globalization;
using System.Net;

namespace CurrencyConverterAPI.Application.Controllers
{

    [ApiVersion("1")]
    [ApiController]
    [Produces("application/json")]
    [Route("api/coin/v{version:apiVersion}")]
    public class CoinController : ControllerBase
    {
        private readonly ILogger<CoinController> _logger;
        private readonly ICoinAppService _coinAppService;
        private readonly IExchangeAppService _exchangeAppService;

        public CoinController(ILogger<CoinController> logger, ICoinAppService coinAppService, IExchangeAppService exchangeAppService)
        {
            _logger = logger;
            _coinAppService = coinAppService;
            _exchangeAppService = exchangeAppService;
        }

        /// <summary>
        /// Gets the list of the coins registered in the base.
        /// </summary>
        /// <remarks>
        /// Example:
        ///
        ///     GET /api/coin/v1
        ///
        /// </remarks>
        /// <returns>Returns the list of the coins.</returns>
        /// <response code="200">Gets the list of the coins registered in the base</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<Coin>))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> GetCoins()
        {
            try
            {
                var coins = await _coinAppService.GetCoins();
                return Ok(coins);
            }
            #region Catch
            catch (MongoException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoins", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoins", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Gets the coin registered in the base.
        /// </summary>
        /// <remarks>
        /// Example:
        ///
        ///     GET /api/coin/v1/1
        ///
        /// </remarks>
        /// <param name="id">Coin Id</param>
        /// <returns>Return a coin.</returns>
        /// <response code="200">Returns a coin registered in the base.</response>
        /// <response code="404">Returns the status code and message about coin not found.</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpGet("{id}", Name = "GetCoin")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Coin))]
        [ProducesResponseType((int)HttpStatusCode.NotFound, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> GetCoin(long id)
        {
            try
            {
                var coin = await _coinAppService.GetCoin(id);
                if (coin is null)
                    return NotFound(new Error((int)HttpStatusCode.NotFound, HandlerErrorResponseMessage.NotFoundCoin));
                return Ok(coin);
            }
            #region Catch
            catch (MongoException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoins", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Registers a new coin in the base.
        /// </summary>
        /// <remarks>
        /// Example:
        ///
        ///     POST /api/coin/v1
        ///     {
        ///        "name": "Jedi",
        ///        "acronym": "JDI",
        ///        "price": 0.50
        ///     }
        ///
        /// </remarks>
        /// <param name="coin">New coin to be registered, with price in USD.</param>
        /// <returns>The new coin.</returns>
        /// <response code="201">Return a new coin created.</response>
        /// <response code="400">Returns the status code and the request failed message (parameter validation).</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(Coin))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> CreateCoin([FromBody] CoinInput coin)
        {
            try
            {
                if (coin is null)
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestCoin));

                var coinIsValid = coin.IsValid();
                if (!string.IsNullOrEmpty(coinIsValid))
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, coinIsValid));

                var coinIsExistInDb = await _coinAppService.IsExistCoinByAcronym(coin.Acronym);
                if (coinIsExistInDb)
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestCoinExistInDB));

                var coinIsExistInCache = await _exchangeAppService.IsExistAcronymInCache(coin.Acronym);
                if (coinIsExistInCache)
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestCoinExistInCacheOrApi));

                var coinIsExistInAPI = await _exchangeAppService.AcronymIsExistInAPI(coin.Acronym);
                if (coinIsExistInAPI)
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestCoinExistInCacheOrApi));

                var coindDb = await _coinAppService.CreateCoin(coin);
                return CreatedAtRoute("GetCoin", new { id = coindDb.Id }, coindDb);
            }
            #region Catch
            catch (MongoException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Updates an existing coin in the base.
        /// </summary>
        /// <remarks>
        /// Example:
        ///
        ///     PUT /api/coin/v1/1
        ///     {
        ///        "name": "Jedi Coin",
        ///        "acronym": "JDI",
        ///        "price": 0.83
        ///     }
        ///
        /// </remarks>
        /// <param name="id">Id of the coin to be updated</param>
        /// <param name="coin">Coin with the information to be updated, with price in USD.</param>
        /// <returns>No Content</returns>
        /// <response code="204">No content.</response>
        /// <response code="404">Returns the status code and message about coin not found.</response>
        /// <response code="400">Returns the status code and the request failed message (parameter validation).</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.NotFound, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> UpdateCoin(long id, [FromBody] CoinInput coin)
        {
            try
            {
                if (coin is null)
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestCoin));

                var coinIsValid = coin.IsValid();
                if (!string.IsNullOrEmpty(coinIsValid))
                    return BadRequest(new Error((int)HttpStatusCode.BadRequest, coinIsValid));

                var coinDb = await _coinAppService.IsExistCoinById(id);
                if (!coinDb)
                    return NotFound(new Error((int)HttpStatusCode.NotFound, HandlerErrorResponseMessage.NotFoundCoin));

                await _coinAppService.UpdateCoin(id, coin);
                return NoContent();
            }
            #region Catch
            catch (MongoException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Deletes an existing coin in the base.
        /// </summary>
        /// <remarks>
        /// Example:
        ///
        ///     DELETE /api/coin/v1/1
        ///
        /// </remarks>
        /// <param name="id">Id of the coin to be deleted</param>
        /// <returns>No content</returns>
        /// <response code="204">No content.</response>
        /// <response code="404">Returns the status code and message about coin not found.</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.NotFound, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> DeleteCoin(long id)
        {
            try
            {
                var coinDb = await _coinAppService.GetCoin(id);
                if (coinDb is null)
                    return NotFound(new Error((int)HttpStatusCode.NotFound, HandlerErrorResponseMessage.NotFoundCoin));

                await _coinAppService.DeleteCoin(id);
                return NoContent();
            }
            #region Catch
            catch (MongoException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "CreateCoin", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Convert between fiat, crypto and fictitious currencies
        /// </summary>
        /// <param name="from">Source coin</param>
        /// <param name="to">Final coin</param>
        /// <param name="amount">Value to be converted</param>
        /// <returns>Converted value</returns>
        /// <response code="200">Returns the query parameters informed and the converted value</response>
        /// <response code="400">Returns the status code and the request failed message (parameter validation).</response>
        /// <response code="404">Returns the status code and message about coin not available for conversion.</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpGet("converter")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(CoinConverted))]
        [ProducesResponseType((int)HttpStatusCode.BadRequest, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.NotFound, Type = typeof(Error))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> Converter([FromQuery] string from, [FromQuery] string to, [FromQuery] string amount)
        {
            try
            {
                decimal number = 0;
                bool hasError = true;
                ActionResult returnApi = null;
                dynamic result = null;

                ValidadeInputParams(from, to, amount, ref number, ref hasError, ref returnApi, ref result);

                if (returnApi is null)
                {
                    result = await _exchangeAppService.GetExchange(from.Trim().ToUpper(), to.Trim().ToUpper(), number);

                    if (result.GetType().Name == typeof(CoinConverted).Name)
                    {
                        hasError = false;
                        returnApi = Ok(result);
                    }
                    else
                    {
                        switch (result.StatusCode)
                        {
                            case (int)HttpStatusCode.NotFound:
                                returnApi = NotFound(result);
                                break;
                            case (int)HttpStatusCode.BadRequest:
                                returnApi = BadRequest(result);
                                break;
                            default:
                                break;
                        }
                    }
                }

                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError, "Converter", (hasError ? result.Message : ""), new string[3] { from, to, amount });
                return returnApi;
            }
            #region Catch
            catch (HttpRequestException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableExceededRetry)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (BrokenCircuitException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableBrokenCircuit)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (RedisConnectionException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, "Redis crashed.")
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "Converter", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        /// <summary>
        /// Display listing of available coins for conversion
        /// </summary>
        /// <returns>List of available coins for conversion</returns>
        /// <response code="200">Returns the query parameters informed and the converted value</response>
        /// <response code="503">Returns the status code and message about the request processing failure.</response>
        [HttpGet("converter/availables")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(AcronymCoins))]
        [ProducesResponseType((int)HttpStatusCode.ServiceUnavailable, Type = typeof(Error))]
        public async Task<ActionResult> GetCoinsAvailablesForExchange()
        {
            try
            {
                var acronyms = new AcronymCoins();

                //PEGA DO BANCO 
                var acronymInDb = await _coinAppService.GetAcronymCoins();
                if (acronymInDb != null && acronymInDb.Any())
                    acronyms.coins.AddRange(acronymInDb);

                // PEGA DA API
                var acronymInApi = await _exchangeAppService.GetAcronymCoins();
                if (acronymInApi != null && acronymInApi.Any())
                    acronyms.coins.AddRange(acronymInApi);

                acronyms.coins.Sort();

                return Ok(acronyms);
            }
            #region Catch
            catch (HttpRequestException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoinsAvailablesForExchange", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableExceededRetry)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (BrokenCircuitException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoinsAvailablesForExchange", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.ServiceUnavailableBrokenCircuit)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (RedisConnectionException ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoinsAvailablesForExchange", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, "Redis crashed.")
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            catch (Exception ex)
            {
                Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), hasError: true, "GetCoinsAvailablesForExchange", ex.GetType().Name + "=>" + ex.Message.ToString());
                var objectResult = new ObjectResult(
                    new Error((int)HttpStatusCode.ServiceUnavailable, HandlerErrorResponseMessage.Exception)
                );
                objectResult.StatusCode = (int)HttpStatusCode.ServiceUnavailable;
                return objectResult;
                throw;
            }
            #endregion
        }

        private void ValidadeInputParams(string from, string to, string amount, ref decimal number, ref bool hasError, ref ActionResult returnApi, ref dynamic response)
        {
            if (String.IsNullOrWhiteSpace(from))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamFromIsRequired)
                    );
                return;
            }
            else if (String.IsNullOrWhiteSpace(to))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamToIsRequired)
                    );
                return;
            }

            if (String.IsNullOrWhiteSpace(amount))
            {
                returnApi = BadRequest(response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestParamAmountIsRequired)
                    );
                return;
            }
            else if (!Decimal.TryParse(amount.Trim(), NumberStyles.Number, CultureInfo.InvariantCulture, out number))
            {
                returnApi = BadRequest(
                    response = new Error(
                        (int)HttpStatusCode.BadRequest, HandlerErrorResponseMessage.BadRequestAmountInvalid(amount)
                    )
                );
                return;
            }
        }
    }
}
