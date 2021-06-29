import fetch from 'node-fetch';

class Fetch {
    constructor () {
        // -
    }

    async get (url) {
        try {
            const response = await fetch(url);

            return response.json();
        } catch (err) {
            throw err;
        }
    }
}

export default new Fetch();