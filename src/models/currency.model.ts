/**
 * Describes a currency in the system
 */
export class Currency {
    public id: string;
    public usdRate: number;
    public rateDate: Date;

    /**
     * Constructor of the currency object
     */
    constructor(id: string, usdRate: number, rateDate: any = null) {
        this.id = id;
        this.usdRate = usdRate;
        this.rateDate = rateDate || new Date();
    }

    /**
     * Returns if the object is valid by checking the values of Id and UsdRate properties
     */
    public isValid(): boolean {
        return this.id != undefined && this.usdRate != undefined;
    }
}
