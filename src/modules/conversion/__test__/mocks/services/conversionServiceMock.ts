export const conversionServiceMock = {
    convert: jest.fn((queryParams) => {
        const calcRatio = (queryParams.from.ratio * queryParams.amount) / queryParams.to.ratio;
        return Promise.resolve({
            from: queryParams.from,
            to: queryParams.to,
            amount: calcRatio,
        });
    }),
    _updatePricesByRealQuotes: jest.fn(),
};
