export interface DeleteCurrencyRepository{
    deleteByShortName (shortName:string): Promise<boolean>
}
