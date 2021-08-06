export interface ICurrency {
    _id?: string;
    name: string;
    code: string;
    valueInUSD: number;
    created_at?: Date;
    updated_at?: Date;

}