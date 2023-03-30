import ConfigsEntity from "../entities/jsons/configs-entity";
import Utils from "./utils";

export default class ValidationImpl {

    checkIfCurrencyCanBeDeleted(currency: string) {
        this.checkIfCurrencyIsNotCurrencyBacking(currency);
        const exists = this.checkCurrencyFromConfigs(currency);        
        if(!exists) {
            throw new Error("A moeda: " + currency + " que você está tentando deletar, não existe.");
        }
    }

    checkIfCurrencyAlreadyExists(currency: string) {        
        const exists = this.checkCurrencyFromConfigs(currency);
        if(exists) {
            throw new Error("Moeda: " + currency + " Já está cadastrada.");
        }       
    }

    checkIfConversionHasSameCurrency(from: string, to: string) {
        if(from === to) {
            throw new Error("Moeda de origem não pode ser igual a moeda de destino.");
        }
    }

    validateCurrencyConversion(field: string, currency: string) {        
        const exists = this.checkCurrencyFromConfigs(currency);
        if(!exists) {
            throw new Error("Moeda enviada no campo " + field + " não é suportada: " + currency);
        }        
    }

    private checkIfCurrencyIsNotCurrencyBacking(currency: string) {
        const configs: ConfigsEntity = Utils.loadJsonFileByName("configs.json");
        if(currency === configs.currencyBacking) {
            throw new Error("OK, Sério que você está tendando deletar a moeda usada como lastro ?");
        }
    }

    private checkCurrencyFromConfigs(currency: string) {
        const configs: ConfigsEntity = Utils.loadJsonFileByName("configs.json");
        return configs.currencies.some(currencyConfig => {
            return currencyConfig.abbreviation === currency;
        });
    }

}