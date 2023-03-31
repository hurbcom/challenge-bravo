export default class ApiError extends Error {
    private statusCode: number;
    
    constructor(message: string) {
        super(message);
        this.name = "ThirdPartyApiError";
        this.statusCode = 500;
    }

    getStatusCode() {        
        return this.statusCode;
    }
}