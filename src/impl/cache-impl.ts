import Utils from "./utils";

export default class CacheImpl {

    public saveQuotationCache(quotaion: any, conversion: string) {
        const cache: any = Utils.loadJsonFileByName("cache-quotations.json");
        cache[conversion.replace('-', '')] = quotaion;
        Utils.saveJsonFile(cache, "cache-quotations.json");
    }

    public saveAvailableApisCache(availableApis: Array<string>) {        
        const now = new Date();
        const cache: any = Utils.loadJsonFileByName("available-conversions.json");
        cache.create_date = now;
        cache.conversions = availableApis;
        Utils.saveJsonFile(cache, "available-conversions.json");
    }

    public getQuotationCache(conversion: string) {
        const cache: any = Utils.loadJsonFileByName("cache-quotations.json");
        return cache[conversion.replace('-', '')];
    }

    public getAvailableApisCache() {
        const cache: any = Utils.loadJsonFileByName("available-conversions.json");
        return cache.conversions
    }

    public checkIfExistAvailableApiValidCache() {
        const cache: any = Utils.loadJsonFileByName("available-conversions.json");
        if(cache.create_date !== "") {
            const date = new Date(cache.create_date);
            date.setHours(date.getHours() + 3);
            const now = new Date();
            const teste = [];
            teste.length
            return ((now.getTime() <= date.getTime()) && cache.conversions.length > 0);
        }
        return false;
    }

    public checkIfConversionHasValidCache(conversion: string): boolean {
        const cache: any = Utils.loadJsonFileByName("cache-quotations.json");
        let quotaion = cache[conversion.replace('-', '')];
        
        if(quotaion) {
            const date = new Date(quotaion.create_date);
            date.setHours(date.getHours() + 3);
            const now = new Date();

            return now.getTime() <= date.getTime();
        }

        return false;
    }
}