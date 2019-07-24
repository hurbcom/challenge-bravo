/**
 *  Classe para representar as Moedas
 */
export class Currency {



    private _symbol: string;
    private _title: string;
    private _value: number;
    private _qty: number;


    constructor(symbol: string,  value: number = 1, qty: number = 1){
          this._symbol= symbol
          this._value = value * qty
    }



    /* getter and setters - Acessores e Modificadores */

    public get symbol(): string {
        return this._symbol;
    }


    public set symbol(value: string) {
        this._symbol = value;
    }


    public get title(): string {
        return this._title;
    }


    public set title(value: string) {
        this._title = value;
    }


    public get value(): number {
        return this._value;
    }


    public set value(value: number) {
        this._value = value;
    }


    public get qty(): number {
        return this._qty;
    }
    public set qty(value: number) {
        this._qty = value;
    }



}
