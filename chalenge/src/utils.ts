export const stringToFloat = (str: string) => {
    const replacedStr = str.replace(new RegExp(",", "g"), ".");
    return Number(replacedStr);
};