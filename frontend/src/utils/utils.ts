import SelectOption from '../../dto/select-option';

type LabelType<T> = string | ((val: T) => string);

export default class Utils {

    static convertToSelectOption<T>(valArray: {[key: string]: any}[], labelProperty: LabelType<T>, valueProperty?: string, sort?: boolean): SelectOption[];
    static convertToSelectOption<T>(valObject: {[key: string]: any}, labelProperty: LabelType<T>, valueProperty?: string, sort?: boolean): SelectOption;
    static convertToSelectOption<T>(val: any, labelProperty: LabelType<T>, valueProperty: string = 'id', sort: boolean = true): SelectOption | SelectOption[] {
        if (Array.isArray(val)) {
            const array = val.map(a => {
                const label = (typeof labelProperty === 'function') ? labelProperty(a) : a[labelProperty];
                return {value: a[valueProperty], label: label}
            });
            if (sort) {
                Utils.arraySortByProperty(array, 'label');
            }
            return array;
        } else {
            const label = (typeof labelProperty === 'function') ? labelProperty(val) : val[labelProperty];
            return {value: val[valueProperty], label: label}
        }
    }

    static arraySortByProperty(array: {[key: string]: any}[], property: string) {
        array.sort((a, b) => {
            if (a[property] < b[property]) return -1;
            if (a[property] > b[property]) return 1;
            return 0;
        });
    }

    static numberFormat(number: number | string, decimals: number, decimalPoint: string = ',', thousandsSeparator: string = '.'): string {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        // noinspection JSUnusedAssignment
        let n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousandsSeparator === 'undefined') ? ',' : thousandsSeparator,
            dec = (typeof decimalPoint === 'undefined') ? '.' : decimalPoint,
            s = [],
            toFixedFix = (n: number, prec: number) => {
                const k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    static numberStringToNumber(number: string | number, decimalPoint: string = ',', thousandsSeparator: string = '.'): number {
        if (typeof number === 'number') {
            return number;
        }
        return parseFloat(number.replaceAll(thousandsSeparator, '').replace(decimalPoint, '.'));
    }

    static mergeArrayOfObjectsByProperty(oldArray: any[], newArray: any[], p: string) {
        return oldArray.filter( o => !newArray.find ( n => o[p] === n[p]) ).concat(newArray);
    }
}
