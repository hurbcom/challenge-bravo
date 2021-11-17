import { connection } from "../connection";
import { Cotation } from "../entity/Cotation";


export class CotationRepository {

    create = async (cotation: Cotation): Promise<any> => {

        const result = await connection.raw(`

        INSERT INTO hurb_cotation (code, codein, name, high, low, varBid,
             pctChange, bid, ask, timestamp, createDate) VALUES ('${cotation.code}', '${cotation.codein}','${cotation.name}',
             '${cotation.high}', '${cotation.low}', '${cotation.varBid}','${cotation.pctChange}','${cotation.bid}',
             '${cotation.ask}', '${cotation.timestamp}', '${cotation.createDate}')
    `)
        return result[0][0]

    }

    getByCodeAndCodeIn = async (code: string, codeIn: string): Promise<any> => {
        const result = await connection.raw(`
            SELECT * FROM hurb_cotation WHERE code = ('${code}') AND codein = ('${codeIn}')
        `)

        return result[0][0]
    }
}