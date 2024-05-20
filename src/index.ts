import { App } from "./app"
import { currencyController } from "./app/controllers/CurrencyController";
import 'dotenv/config';
import axios from "axios";
// import * as cheerio from 'cheerio';

new App().server.listen(process.env.PORT);
currencyController.init();
// test();

// async function test() {
//     try {
//         let resp: any = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', { headers: { 'X-CMC_PRO_API_KEY': process.env.MCAPIKEY } });
//         if (resp.data) {
//             console.log(resp.data);
//             resp.data.data.forEach((a: any) => {
//                 if (a.symbol == 'GTA') {
//                     console.log(a);
//                 }
//             })

//         }

//         let resp2: any = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=29533', { headers: { 'X-CMC_PRO_API_KEY': process.env.MCAPIKEY } });
//         if (resp2.data) {
//             console.log(resp2.data);
//         }
//     } catch (err: any) {
//         console.log(err.response.data)
//     }
// }


// function formatTextToNumber(numberStr: string, decimalSymbol: string) {
//     if (decimalSymbol == ',') {
//         return numberStr.replace(/[^\d,]|\.(?=.*\.)/g, '').replace(',', '.');
//     } else
//         return numberStr.replace(/[^\d.]|\.(?=.*\.)/g, '');
// }
