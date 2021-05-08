interface ICreateExchangeDTO {
    from: string;
    to: string;
    expires_date: Date;
    amount: number;
    value: number;
    rate: number;
    base: string;
}

export { ICreateExchangeDTO };
