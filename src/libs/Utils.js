class Utils {
    constructor() {
        // -
    }

    newObject(...args) {
        const objects = [{}].concat(args);
        
        return objects.reduce((acc, cur) => ({ ...acc, ...cur }));
    }
}

export default new Utils();