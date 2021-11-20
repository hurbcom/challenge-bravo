"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis = require('promise-redis')();
console.log("CACHE");
console.log(process.env.REDIS_URL);
const redisClient = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
});
class CacheService {
    constructor() {
        this.get = (key) => __awaiter(this, void 0, void 0, function* () {
            return yield redisClient.get(key);
        });
        this.set = (key, value) => __awaiter(this, void 0, void 0, function* () {
            return yield redisClient.set(key, value);
        });
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=CacheService.js.map