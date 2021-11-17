export class Coin {

    id: number
    code: string
    name: string
    valueInUSD: string

    constructor(id: number, code: string, name: string, valueInUSD: string) {
        this.id = id
        this.code = code
        this.name = name
        this.valueInUSD = valueInUSD
    }
}