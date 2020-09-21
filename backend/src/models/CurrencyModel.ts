
export class CurrencyModel {
    public id: string;
    public codigo: string;
    public data: string;
    public cotacao: number;

    constructor(id: string | any, codigo: string | any, data: string | any, cotacao: number | any) {
        this.id = id;
        this.codigo = codigo;
        this.data = data;
        this.cotacao = cotacao;
    }
}