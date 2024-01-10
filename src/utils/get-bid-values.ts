const getBidValues = async (data: any, key: string) => {
    for (const currencyKey in data) {
        const currency = data[currencyKey];
        if (currency.code === key) {
            return currency.bid;
        }
    }
    return undefined;
};

export default getBidValues