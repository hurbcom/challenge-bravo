export interface Job{
    schedule:string|Date
    handle(input?:any):Promise<void>
    getName():string,
}
