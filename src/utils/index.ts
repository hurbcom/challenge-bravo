export const convertStringToValue = (value: string) => {
    const newValue =
        parseFloat(value.split(".")[0]) > 1 ? value.replace(".", "") : value;
    return parseFloat(newValue);
};
