import { connection } from "../connection";
import { Cotation } from "../entity/Cotation";


export class CotationRepository {

    create = async (cotation: Cotation): Promise<any> => {
        const result = await connection.raw(`

        INSERT INTO hurb_cotation (code, codein, name, varBid,
             pctChange, bid, ask, createDate) VALUES ('${cotation.code}', '${cotation.codein}','${cotation.name}',
             '${cotation.varBid}','${cotation.pctChange}','${cotation.bid}',
             '${cotation.ask}', ${cotation.createDate})
    `)
        return result[0][0]

    }
}