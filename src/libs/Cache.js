import NodeCache from 'node-cache';
import config from '../config/cache';

class Cache {
    constructor () {
        this.cache = new NodeCache(config.data);
    }

    _formatData (dataObj) {
        const entries = Object.entries(dataObj); 
        
        return entries.reduce((acc, item) => {
            acc.push({
                key: item[0],
                val: item[1],
                ttl: config.TTL
            });

            return acc;
        }, []);
    }

    set (dataObj) {
        const dataList = this._formatData(dataObj);

        this.cache.mset(dataList);
    }

    get (dataKey) {
        return this.cache.get(dataKey);
    }

    delete (dataKey) {
        this.cache.del(dataKey);
    }
}

export default new Cache();