import { HttpResponse } from '../../presentation/protocols/http'
import { FreeCurrencyAPIService } from './free-currency-api-service'
import { HTTPClient } from './protocols/http-client'

const makeHttp = ():HTTPClient => {
  class HTTPClientStub implements HTTPClient {
    call (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS', body?: any, headers?: any): Promise<HttpResponse> {
      return new Promise(resolve => resolve({
        statusCode: 200,
        body: { query: { apikey: 'XXX', timestamp: 1638478360, base_currency: 'USD' }, data: { JPY: 113.13294, CNY: 6.37322, CHF: 0.9209, CAD: 1.28165, MXN: 21.34246, INR: 74.94918, BRL: 5.65179, RUB: 73.73555, KRW: 1173.13417, IDR: 14375.24803, TRY: 13.57765, SAR: 3.7514, SEK: 9.04798, NGN: 409.70496, PLN: 4.07238, ARS: 101.09253, NOK: 9.09822, TWD: 27.73673, IRR: 42000.98078, AED: 3.67276, COP: 3934.28218, THB: 33.89068, ZAR: 15.94419, DKK: 6.58262, MYR: 4.22808, SGD: 1.36961, ILS: 3.16464, HKD: 7.79111, EGP: 15.66034, PHP: 50.38072, CLP: 836.04136, PKR: 176.50264, IQD: 1458.03234, DZD: 138.69388, KZT: 437.73649, QAR: 3.6629, CZK: 22.51978, PEN: 4.05932, RON: 4.37905, VND: 22730.28908, BDT: 85.70241, HUF: 322.58658, UAH: 27.20046, AOA: 583.01505, MAD: 9.22342, OMR: 0.38491, CUC: 24.00068, BYR: 3.00007, AZN: 1.69304, LKR: 202.00561, SDG: 436.33814, SYP: 2511.06776, MMK: 1776.52226, DOP: 56.64162, UZS: 10755.12159, KES: 112.55194, GTQ: 7.72016, URY: 44.1407, HRV: 6.65788, MOP: 8.02521, ETB: 47.98994, CRC: 626.86572, TZS: 2299.04841, TMT: 3.49007, TND: 2.87343, PAB: 1.00002, LBP: 1505.7443, RSD: 104.01156, LYD: 4.58342, GHS: 6.00011, YER: 249.9869, BOB: 6.82011, BHD: 0.37691, CDF: 1994.52424, PYG: 6796.17432, UGX: 3562.10629, SVC: 8.74966, TTD: 6.74637, AFN: 95.98133, NPR: 119.99308, HNL: 24.10125, BIH: 1.73064, BND: 1.36963, ISK: 129.79168, KHR: 4061.06648, GEL: 3.10003, MZN: 63.20093, BWP: 11.6689, PGK: 3.51127, JMD: 153.00347, XAF: 580.55672, NAD: 15.95442, ALL: 106.8527, SSP: 406.46594, MUR: 42.82103, MNT: 2825.03692, NIO: 35.21065, LAK: 10806.16188, MKD: 54.25122, AMD: 487.00658, MGA: 3960.61409, XPF: 105.48248, TJS: 11.28013, HTG: 98.00207, BSD: 1.00002, MDL: 17.6624, RWF: 1021.92029, KGS: 84.79193, GNF: 9311.22766, SRD: 21.42357, SLL: 11025.30492, XOF: 576.01239, MWK: 808.11268, FJD: 2.12926, ERN: 15.0004, SZL: 15.95637, GYD: 207.9822, BIF: 1984.84502, KYD: 0.82501, MVR: 15.42018, LSL: 15.94355, LRD: 141.20152, CVE: 97.59233, DJF: 177.50439, SCR: 13.56341, SOS: 575.0169, GMD: 52.50149, KMF: 433.68889, STD: 21.68061, XRP: 1.02003, AUD: 1.40684, BGN: 1.73084, BTC: 0.0176, JOD: 0.70802, GBP: 0.75132, ETH: 0.00022, EUR: 0.88181, LTC: 0, NZD: 1.46722 } }
      }))
    }
  }
  return new HTTPClientStub()
}

const makeSut = () => {
  const http = makeHttp()
  const sut = new FreeCurrencyAPIService(http, 'any')
  return { http, sut }
}
describe('free currency api service', () => {
  test('should return a list of currencies on success', async () => {
    const { sut } = makeSut()
    const response = await sut.list()
    expect(response).toBeInstanceOf(Array)
    expect(response[0].shortName).toEqual('JPY')
  })
  test('should return an empty array on request fail', async () => {
    const { sut, http } = makeSut()
    jest.spyOn(http, 'call').mockResolvedValueOnce({ statusCode: 500, body: { message: 'any error' } })
    const response = await sut.list()
    expect(response).toEqual([])
  })
  test('should throw if request throws', async () => {
    const { sut, http } = makeSut()
    jest.spyOn(http, 'call').mockRejectedValueOnce(new Error())
    const promise = sut.list()
    await expect(promise).rejects.toThrow()
  })
})
