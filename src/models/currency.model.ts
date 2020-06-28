export class Currency {
    public id: string;
    public usdRate: number;
    public rateDate: Date;

    /**
     * 
     */
    constructor(id: string, usdRate: number, rateDate: any = null) {
        this.id = id;
        this.usdRate = usdRate;
        this.rateDate = rateDate || new Date();
    }

    public isValid(): boolean {
        return this.id != undefined && this.usdRate != undefined;
    }
}
