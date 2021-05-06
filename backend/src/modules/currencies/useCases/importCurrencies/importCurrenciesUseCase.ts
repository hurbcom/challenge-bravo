import csvParse from "csv-parse";
import fs from "fs";

import { ICurrenciesRepository } from "../../repositories/ICurrenciesRepository";

interface IImportCurrency {
    symbol: string;
}

class ImportCurrenciesUseCase {
    constructor(private currenciesRepository: ICurrenciesRepository) {}

    loadCurrencies(file: Express.Multer.File): Promise<IImportCurrency[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path);

            const currencies: IImportCurrency[] = [];

            const parseFile = csvParse();

            stream.pipe(parseFile);

            parseFile
                .on("data", async (line) => {
                    const [symbol] = line;
                    currencies.push({
                        symbol,
                    });
                })
                .on("end", () => {
                    fs.promises.unlink(file.path);
                    resolve(currencies);
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const currencies = await this.loadCurrencies(file);
        currencies.map(async (currency) => {
            const { symbol } = currency;

            const existCurrency = this.currenciesRepository.findBySymbol(
                symbol
            );

            if (!existCurrency) {
                this.currenciesRepository.create({
                    symbol,
                });
            }
        });
    }
}

export { ImportCurrenciesUseCase };
