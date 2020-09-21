
export class CurrencyDTO {
    public codigo: string;
    public data: string;
    public cotacao: number;

    constructor(codigo: string = '', data: string = '', cotacao: number = 0) {

        this.codigo = codigo;
        this.data = data;
        this.cotacao = cotacao;
    }
}