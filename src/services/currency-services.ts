import axios from "axios";


const getTopTenCurrency = async () => {
  const baseURI = process.env.BASE_URI_AWSOMEAPI;
  const favoriteCurrency = "USD-BRL,CAD-BRL,ETH-BRL,EUR-BRL,CHF-BRL,GBP-BRL,CLP-BRL,CNY-BRL,BTC-BRL,AED-BRL";
  const finalURL = `${baseURI}last/${favoriteCurrency}`

  const response = await axios.get(finalURL)

  return response.data
}

const getCurrencyHistory = async (code: string) => {
  const baseURI = process.env.BASE_URI_AWSOMEAPI;
  const currency = code;
  const finalURL = `${baseURI}daily/${currency}/30`

  const response = await axios.get(finalURL)
 
  return response.data
}

export default {
  getCurrencyHistory,
  getTopTenCurrency
}