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