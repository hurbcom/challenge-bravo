export class Currency {
    public id: string;
    public usdValue: number;

    /**
     * 
     */
    constructor(id: string, usdValue: number) {
        this.id = id;
        this.usdValue = usdValue;
    }

    public isValid(): boolean {
        return this.id != undefined && this.usdValue != undefined;
    }
}
