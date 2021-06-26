import Utils from './Utils';

describe('#newObject', () => {
    test("it returns a new object that equals { id: 1 } when passed { id: 1 }", () => {
        const obj1 = {
            id: 1
        };

        try {
            const newObj = Utils.newObject(obj1);

            expect(newObj).not.toBe(obj1);
            expect(newObj).toEqual({ id: 1 });
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });

    
    test("it returns a new object that equals { id: 1, name: 'prop' } when passed { id: 1 } and { name: 'prop' }", () => {
        const obj1 = {
            id: 1
        };
        const obj2 = {
            name: 'prop'
        };

        try {
            const newObj = Utils.newObject(obj1, obj2);

            expect(newObj).not.toBe(obj1);
            expect(newObj).not.toBe(obj2);
            expect(newObj).toEqual({ id: 1, name: 'prop' });
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#arrayAContainsB', () => {
    test("it returns true when passed [1, 2] as the A and B", () => {
        const arrayA = [1, 2];

        try {
            const result = Utils.arrayAContainsB(arrayA, arrayA);

            expect(result).toBeTruthy();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });

    test("it returns true when passed [1, 2] as the A and [2] as the B", () => {
        const arrayA = [1, 2];
        const arrayB = [2];

        try {
            const result = Utils.arrayAContainsB(arrayA, arrayB);

            expect(result).toBeTruthy();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });

    test("it returns false when passed [1] as the A and [1, 2] as the B", () => {
        const arrayA = [1];
        const arrayB = [1, 2];

        try {
            const result = Utils.arrayAContainsB(arrayA, arrayB);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});