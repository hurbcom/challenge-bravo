class Utils {
    constructor() {
        // -
    }

    newObject (...args) {
        const objects = [{}].concat(args);
        
        return objects.reduce((acc, cur) => ({ ...acc, ...cur }));
    }

    arrayAContainsB (arrayA, arrayB) {
        return arrayB.every(item => arrayA.includes(item));
    }
}

export default new Utils();