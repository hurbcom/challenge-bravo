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
    /// This Controller is responsible to deliver the API methods where the currency converion are made
    /// and also the connection with the external API.
    /// </summary>
    [RoutePrefix("api/currencyConversion")]
    public class CurrencyConversionController : ApiController
    {
        private ICurrencyConversionBusinessFacade _currencyConversionFacade = null;

        /// <summary>
        /// This is the constructor of the controller class. Used in the process of dependency inversion 
        /// to turn available the methods from facade class.
        /// </summary>
        /// <param name="currencyConversionFacade"></param>
        public CurrencyConversionController(ICurrencyConversionBusinessFacade currencyConversionFacade)
        {
            _currencyConversionFacade = currencyConversionFacade;
        }

        #region ' External API - Resquest to get the Currency Quotation '

        /// <summary>
        /// This method is used to connect to the external API in order to get the currency data that 
        /// will be used in the currency conversion process.
        /// </summary>
        /// <param name="currencySymbol">string</param>
        /// <returns>currency quotation and other data from requested currency</returns>
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
        /// This method is responsible to calculate the currency conversion.
        /// </summary>
        /// <param name="fromCurrency">string</param>
        /// <param name="toCurrency">string</param>
        /// <param name="amount">double</param>
        /// <returns>A json object with some data about the currency conversion.</returns>
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
