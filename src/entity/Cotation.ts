export class Cotation {

    id: number
    code: string
    codein: string
    name: string
    high: string
    low: string
    varBid: string
    pctChange: string
    bid: string
    ask: string
    timesTamp: string
    createDate: Date
 

    constructor(id: number, code: string, codein: string, name: string, high: string, low: string, varBid: string, 
        pctChange: string, bid: string, ask: string, timesTamp: string, createDate: Date) {

            this.id = id
            this.code = code
            this.codein = codein
            this.name = name
            this.high = high
            this.low = low
            this.varBid = varBid
            this.pctChange = pctChange
            this.bid = bid
            this.ask = ask
            this.timesTamp = timesTamp
           this.createDate = createDate
    }
}