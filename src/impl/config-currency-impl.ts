import SaveCurrencyRequest from "../entities/currency-controller/save-currency-request";
import ValidationImpl from "./validation-impl";
import Utils from "./utils";
import ConfigsEntity from "../entities/jsons/configs-entity";
import CurrencyEntity from "../entities/jsons/currency-entity";
import DeleteCurrencyRequest from "../entities/currency-controller/delete-currency-request";

export default class ConfigCurrencyImpl {

    private validation: ValidationImpl;

    constructor() {
        this.validation = new ValidationImpl();        
    }

    public async saveCurrency(body: SaveCurrencyRequest): Promise<void> {
        this.validation.checkIfCurrencyAlreadyExists(body.currency);
        const configs: ConfigsEntity = Utils.loadJsonFileByName("configs.json");
        configs.currencies.push(this.createCurrencyEntity(body));
        Utils.saveJsonFile(configs, "configs.json");
    }

    public async deleteCurrency(body: DeleteCurrencyRequest) {
        this.validation.checkIfCurrencyCanBeDeleted(body.currency);
        const configs: ConfigsEntity = Utils.loadJsonFileByName("configs.json");
        const indexToDelete = this.findCurrencyIndexInConfigs(body.currency, configs);

        if(indexToDelete === -1) {
            throw new Error("Um Erro Inexperado ocorreu. Não foi possível achar a moeda solicitada");
        }
        configs.currencies.splice(indexToDelete, 1);
        Utils.saveJsonFile(configs, "configs.json");
    }

    private findCurrencyIndexInConfigs(currency: string, configs: ConfigsEntity) {
        return configs.currencies.findIndex(config => {
            return config.abbreviation === currency
        })
    }

    private createCurrencyEntity(body: SaveCurrencyRequest): CurrencyEntity {
        return {
            abbreviation: body.currency,
            isFictional: body.isFictional ? body.isFictional : false,
            currencyBackingUnitValue: body.currencyBackingUnitValue
        }
    }
}