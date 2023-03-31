export default class CurrencyError extends Error {
    private statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "CurrencyError";
        this.statusCode = 500;
    }

    getStatusCode() {        
        return this.statusCode;
    }
}