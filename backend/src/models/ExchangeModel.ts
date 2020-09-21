
export class ExchangeModel {
    public From: string;
    public To: string;
    public Amount: number;

    constructor(from: string = '', to: string = '', amount: number = 0) {
        this.From = from;
        this.To = to;
        this.Amount = amount;
    }
}

