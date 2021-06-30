import Cache from './Cache';
import NodeCache from 'node-cache';
import config from '../config/cache';

jest.mock('node-cache');
jest.mock('../config/cache');

describe('#_formatData', () => {
    test("it returns [{ key: 'name', val: 'Dani' }] when passed { name: 'Dani' }", () => {
        const dataObj = {
            name: 'Dani'
        };

        try {
            const result = Cache._formatData(dataObj);
            const [ nameObj ] = result;

            expect(result).toBeTruthy()
            expect(result.length).toBe(1);
            expect(nameObj).toBeTruthy();
            expect(nameObj).toHaveProperty('key', 'name');
            expect(nameObj).toHaveProperty('val', 'Dani');
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
    test("it returns [{ key: 'name', val: 'Dani' }, { key: 'age', val: 26 }] when passed { name: 'Dani', age: 26 }", () => {
        const dataObj = {
            name: 'Dani',
            age: 26
        };

        try {
            const result = Cache._formatData(dataObj);
            const [ nameObj, ageObj ] = result;

            expect(result).toBeTruthy()
            expect(result.length).toBe(2);
            expect(nameObj).toBeTruthy();
            expect(nameObj).toHaveProperty('key', 'name');
            expect(nameObj).toHaveProperty('val', 'Dani');
            expect(ageObj).toBeTruthy();
            expect(ageObj).toHaveProperty('key', 'age');
            expect(ageObj).toHaveProperty('val', 26);
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});