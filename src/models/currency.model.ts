export class Currency {
    public id: string;
    public usdRate: number;
    public dateRate: Date;

    /**
     * 
     */
    constructor(id: string, usdRate: number) {
        this.id = id;
        this.usdRate = usdRate;
        this.dateRate = new Date();
    }

    public isValid(): boolean {
        return this.id != undefined && this.usdRate != undefined;
    }
}
