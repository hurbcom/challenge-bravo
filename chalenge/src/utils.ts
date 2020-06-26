export const stringToFloat = (str: string) => {
    if(!str) return 0;
    const replacedStr = str.replace(new RegExp(",", "g"), ".");
    return Number(replacedStr);
};