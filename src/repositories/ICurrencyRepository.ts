import { ICurrency } from "../models/ICurrency";


interface ICurrencyRepository {
    create({ name, code, valueInUSD }: ICurrency): Promise<ICurrency> ;
    listAll(): Promise<ICurrency[]> ;       
    getById(_id: string): Promise<ICurrency>;
    getByCode(code: string): Promise<ICurrency> ;
    delete(_id: string): Promise<void> ;
    update({ _id, name, code, valueInUSD, updated_at }: ICurrency): Promise<void> ;
  }
  
  export { ICurrencyRepository }