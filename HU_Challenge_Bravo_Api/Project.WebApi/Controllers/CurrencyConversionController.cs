using AutoMapper;
using Project.Business.DTOs;
using Project.Business.Facades.Interface;
using Project.WebApi.ViewModels;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Project.WebApi.Controllers
{
    /// <summary>
    /// asdadasd
    /// </summary>
    [RoutePrefix("api/currencyConversion")]
    public class CurrencyConversionController : ApiController
    {
        private ICurrencyConversionBusinessFacade _currencyConversionFacade = null;

        /// <summary>
        /// asdasdasd
        /// </summary>
        /// <param name="currencyConversionFacade"></param>
        public CurrencyConversionController(ICurrencyConversionBusinessFacade currencyConversionFacade)
        {
            _currencyConversionFacade = currencyConversionFacade;
        }

        #region ' External API - Resquest to get the Currency Quotation '

        /// <summary>
        /// asdad
        /// </summary>
        /// <param name="currencySymbol"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getCurrenciesQuotation/{currencySymbol}")]
        public async Task<HttpResponseMessage> GetCurrenciesQuotation([FromUri] string currencySymbol)
        {
            CurrencyDTO currencyData = null;

            try
            {
                currencyData = await _currencyConversionFacade.GetCurrencyQuotation(currencySymbol);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            var responseData = Mapper.Map<CurrencyDTO, CurrencyQuotationViewModel>(currencyData);

            return Request.CreateResponse(HttpStatusCode.OK, responseData);
        }

        #endregion

        #region ' Internal API - Request to convert the currency price '

        /// <summary>
        /// asdasdadd
        /// </summary>
        /// <param name="fromCurrency"></param>
        /// <param name="toCurrency"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}")]
        public async Task<HttpResponseMessage> Convert([FromUri] string fromCurrency, string toCurrency, decimal amount)
        {
            ConvertedCurrencyDTO response = null;

            try
            {
                response = await _currencyConversionFacade.GetCurrencyConverted(fromCurrency.ToUpper(), toCurrency.ToUpper(), amount);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
        }

        #endregion
    }
}
